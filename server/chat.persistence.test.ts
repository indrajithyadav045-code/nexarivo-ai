import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  createConversation: vi.fn().mockResolvedValue(42),
  addChatMessage: vi.fn().mockResolvedValue(undefined),
  deleteConversation: vi.fn().mockResolvedValue(true),
  getConversationMessages: vi.fn().mockResolvedValue([]),
  getConversationsByUserId: vi.fn().mockResolvedValue([]),
  getRecentUsage: vi.fn().mockResolvedValue([]),
  getUsageByDay: vi.fn().mockResolvedValue([]),
  getUsageByModel: vi.fn().mockResolvedValue([]),
  getUsageSummary: vi.fn().mockResolvedValue({ totalRequests: 0, totalTokens: 0, averageLatency: 0, successRate: 0, estimatedCostMicros: 0 }),
  recordUsageEvent: vi.fn().mockResolvedValue(undefined),
  searchConversations: vi.fn().mockResolvedValue([]),
  updateChatMessage: vi.fn().mockResolvedValue(true),
}));

vi.mock("./db", () => dbMocks);
vi.mock("./_core/llm", () => ({ invokeLLM: vi.fn().mockResolvedValue({ choices: [{ message: { content: "A direct answer" } }], usage: {} }) }));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = {
  user: { id: 7, openId: "test-user", email: "test@example.com", name: "Test User", loginMethod: "test", role: "user", subscriptionTier: "free", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} as TrpcContext;

describe("chat persistence contracts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("delegates loading, search, edit, and delete to user-scoped persistence helpers", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.chatHistory.list();
    await caller.chatHistory.messages({ conversationId: 42 });
    await caller.chatHistory.search({ query: "ohm" });
    await caller.chatHistory.updateMessage({ messageId: 9, content: "Updated answer" });
    await caller.chatHistory.delete({ conversationId: 42 });

    expect(dbMocks.getConversationsByUserId).toHaveBeenCalledWith(7);
    expect(dbMocks.getConversationMessages).toHaveBeenCalledWith(7, 42);
    expect(dbMocks.searchConversations).toHaveBeenCalledWith(7, "ohm");
    expect(dbMocks.updateChatMessage).toHaveBeenCalledWith(7, 9, "Updated answer");
    expect(dbMocks.deleteConversation).toHaveBeenCalledWith(7, 42);
  });

  it("persists a real AI exchange when a new user question is answered", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ai.chat({ model: "nexarivo-lite", messages: [{ role: "user", content: "What is Ohm's law?" }] });

    expect(result.content).toBe("A direct answer");
    expect(result.conversationId).toBe(42);
    expect(dbMocks.createConversation).toHaveBeenCalledWith(7, "nexarivo-lite", "What is Ohm's law?");
    expect(dbMocks.addChatMessage).toHaveBeenCalledWith(42, "user", "What is Ohm's law?");
    expect(dbMocks.addChatMessage).toHaveBeenCalledWith(42, "assistant", "A direct answer", "nexarivo-lite");
  });
});

