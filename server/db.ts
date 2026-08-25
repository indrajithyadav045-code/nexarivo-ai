import { and, desc, eq, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { chatConversations, chatMessages, InsertUser, usageEvents, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createConversation(userId: number, model: string, title = "New Chat") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(chatConversations).values({ userId, model, title });
  return Number(result[0].insertId);
}

export async function getConversationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatConversations).where(eq(chatConversations.userId, userId)).orderBy(desc(chatConversations.updatedAt));
}

export async function getConversationMessages(userId: number, conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  const ownedConversation = await db.select({ id: chatConversations.id }).from(chatConversations)
    .where(and(eq(chatConversations.id, conversationId), eq(chatConversations.userId, userId))).limit(1);
  if (!ownedConversation[0]) return [];
  return db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId)).orderBy(chatMessages.createdAt);
}

export async function addChatMessage(conversationId: number, role: "user" | "assistant", content: string, model?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(chatMessages).values({ conversationId, role, content, model });
}

export async function updateChatMessage(userId: number, messageId: number, content: string) {
  const db = await getDb();
  if (!db) return false;
  const owned = await db.select({ id: chatMessages.id }).from(chatMessages).innerJoin(chatConversations, eq(chatMessages.conversationId, chatConversations.id))
    .where(and(eq(chatMessages.id, messageId), eq(chatConversations.userId, userId))).limit(1);
  if (!owned[0]) return false;
  await db.update(chatMessages).set({ content }).where(eq(chatMessages.id, messageId));
  return true;
}

export async function searchConversations(userId: number, query: string) {
  const db = await getDb();
  if (!db) return [];
  const normalized = `%${query.trim()}%`;
  const titleMatches = await db.select().from(chatConversations).where(and(eq(chatConversations.userId, userId), like(chatConversations.title, normalized))).orderBy(desc(chatConversations.updatedAt));
  const messageMatches = await db.select({ conversation: chatConversations }).from(chatMessages).innerJoin(chatConversations, eq(chatMessages.conversationId, chatConversations.id))
    .where(and(eq(chatConversations.userId, userId), like(chatMessages.content, normalized))).orderBy(desc(chatConversations.updatedAt));
  const merged = new Map<number, typeof titleMatches[number]>();
  [...titleMatches, ...messageMatches.map((row) => row.conversation)].forEach((chat) => merged.set(chat.id, chat));
  return Array.from(merged.values());
}

export async function deleteConversation(userId: number, conversationId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.delete(chatConversations).where(and(eq(chatConversations.id, conversationId), eq(chatConversations.userId, userId)));
  return Number(result[0].affectedRows ?? 0) > 0;
}

export async function recordUsageEvent(input: {
  userId: number;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs: number;
  status?: "success" | "error";
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(usageEvents).values({
    userId: input.userId,
    model: input.model,
    inputTokens: input.inputTokens ?? 0,
    outputTokens: input.outputTokens ?? 0,
    latencyMs: input.latencyMs,
    status: input.status ?? "success",
  });
}

const estimatedCostPerMillionMicros: Record<string, number> = {
  "nexarivo-lite": 500000,
  "nexarivo-pro": 3000000,
  "nexarivo-ultra": 15000000,
  "gpt-3.5": 500000,
  "gpt-4": 10000000,
  "claude-sonnet": 3000000,
  "claude-opus": 15000000,
};

export async function getUsageSummary(userId: number) {
  const db = await getDb();
  if (!db) return { totalRequests: 0, totalTokens: 0, averageLatency: 0, successRate: 0, estimatedCostMicros: 0 };
  const [summary] = await db.select({
    totalRequests: sql<number>`COALESCE(SUM(${usageEvents.requestCount}), 0)`,
    inputTokens: sql<number>`COALESCE(SUM(${usageEvents.inputTokens}), 0)`,
    outputTokens: sql<number>`COALESCE(SUM(${usageEvents.outputTokens}), 0)`,
    averageLatency: sql<number>`COALESCE(AVG(${usageEvents.latencyMs}), 0)`,
    successfulRequests: sql<number>`COALESCE(SUM(CASE WHEN ${usageEvents.status} = 'success' THEN ${usageEvents.requestCount} ELSE 0 END), 0)`,
  }).from(usageEvents).where(eq(usageEvents.userId, userId));
  const totalRequests = Number(summary?.totalRequests ?? 0);
  const totalTokens = Number(summary?.inputTokens ?? 0) + Number(summary?.outputTokens ?? 0);
  const modelRows = await getUsageByModel(userId);
  const estimatedCostMicros = modelRows.reduce((total, row) => total + Number(row.estimatedCostMicros), 0);
  return {
    totalRequests,
    totalTokens,
    averageLatency: Math.round(Number(summary?.averageLatency ?? 0)),
    successRate: totalRequests ? Math.round((Number(summary?.successfulRequests ?? 0) / totalRequests) * 1000) / 10 : 0,
    estimatedCostMicros,
  };
}

export async function getUsageByModel(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    model: usageEvents.model,
    requests: sql<number>`SUM(${usageEvents.requestCount})`,
    tokens: sql<number>`SUM(${usageEvents.inputTokens} + ${usageEvents.outputTokens})`,
  }).from(usageEvents).where(eq(usageEvents.userId, userId)).groupBy(usageEvents.model).orderBy(desc(sql`SUM(${usageEvents.requestCount})`));
  return rows.map((row) => ({ ...row, estimatedCostMicros: Math.round((Number(row.tokens) / 1_000_000) * (estimatedCostPerMillionMicros[row.model] ?? 0)) }));
}

export async function getUsageByDay(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    day: sql<string>`DATE(${usageEvents.createdAt})`,
    requests: sql<number>`SUM(${usageEvents.requestCount})`,
    tokens: sql<number>`SUM(${usageEvents.inputTokens} + ${usageEvents.outputTokens})`,
  }).from(usageEvents).where(eq(usageEvents.userId, userId)).groupBy(sql`DATE(${usageEvents.createdAt})`).orderBy(sql`DATE(${usageEvents.createdAt})`);
}

export async function getRecentUsage(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(usageEvents).where(eq(usageEvents.userId, userId)).orderBy(desc(usageEvents.createdAt)).limit(10);
}

