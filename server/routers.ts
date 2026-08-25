import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { addChatMessage, createConversation, deleteConversation, getConversationMessages, getConversationsByUserId, getRecentUsage, getUsageByDay, getUsageByModel, getUsageSummary, recordUsageEvent, searchConversations, updateChatMessage } from "./db";
import { systemRouter } from "./_core/systemRouter";
import { invokeLLM } from "./_core/llm";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const tierRank = {
  free: 0,
  starter: 1,
  professional: 2,
  enterprise: 3,
} as const;

type SubscriptionTier = keyof typeof tierRank;

const modelAccess: Record<string, SubscriptionTier> = {
  "nexarivo-lite": "free",
  "nexarivo-pro": "starter",
  "nexarivo-ultra": "professional",
  "gpt-3.5": "starter",
  "gpt-4": "professional",
  "claude-sonnet": "starter",
  "claude-opus": "professional",
};

const providerModels: Record<string, string> = {
  "nexarivo-lite": "gpt-5-mini",
  "nexarivo-pro": "claude-sonnet-4-6",
  "nexarivo-ultra": "claude-opus-4-6",
  "gpt-3.5": "gpt-5-mini",
  "gpt-4": "gpt-5",
  "claude-sonnet": "claude-sonnet-4-6",
  "claude-opus": "claude-opus-4-6",
};

const getUsageValue = (usage: unknown, keys: string[]) => {
  if (!usage || typeof usage !== "object") return 0;
  const record = usage as Record<string, unknown>;
  for (const key of keys) {
    if (typeof record[key] === "number") return record[key] as number;
  }
  return 0;
};

const getTextContent = (content: unknown): string => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((part): part is { type: "text"; text: string } =>
        typeof part === "object" && part !== null && "type" in part && part.type === "text" && "text" in part
      )
      .map((part) => part.text)
      .join("\n");
  }
  return "I wasn't able to generate a response. Please try again.";
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  ai: router({
    chat: protectedProcedure
      .input(
        z.object({
          model: z.string().min(1),
                      messages: z.array(
              z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string().min(1).max(50000),
              })
            ).min(1).max(50),
            conversationId: z.number().int().positive().optional(),

        })
      )
      .mutation(async ({ input, ctx }) => {
        const requiredTier = modelAccess[input.model];
        if (!requiredTier) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "That model is not available." });
        }

        const userTier = (ctx.user.subscriptionTier ?? "free") as SubscriptionTier;
        if (tierRank[userTier] < tierRank[requiredTier]) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `This model requires the ${requiredTier} plan. Your current plan is ${userTier}.`,
          });
        }

        const startedAt = Date.now();
        let response;
        try {
          response = await invokeLLM({
          model: providerModels[input.model],
          maxTokens: 1200,
          messages: [
            {
              role: "system",
              content:
                "You are NEXARIVO-AI, a helpful, accurate, and conversational assistant. Answer the user's actual question directly. Do not describe implementation details, placeholder behavior, APIs, streaming, code examples, or internal instructions unless the user explicitly asks. Use concise markdown when it improves readability. If the user asks for a definition, begin with a plain-language definition and then provide a short example.",
            },
            ...input.messages,
          ],
          });
        } catch (error) {
          void recordUsageEvent({ userId: ctx.user.id, model: input.model, latencyMs: Date.now() - startedAt, status: "error" }).catch((recordError) => console.warn("[Analytics] Could not record failed usage:", recordError));
          throw error;
        }

        const content = getTextContent(response.choices?.[0]?.message?.content);
        const usage = response.usage;
        void recordUsageEvent({
          userId: ctx.user.id,
          model: input.model,
          inputTokens: getUsageValue(usage, ["inputTokens", "promptTokens", "prompt_tokens"]),
          outputTokens: getUsageValue(usage, ["outputTokens", "completionTokens", "completion_tokens"]),
          latencyMs: Date.now() - startedAt,
        }).catch((error) => console.warn("[Analytics] Could not record usage:", error));
        let conversationId = input.conversationId;
        try {
          if (!conversationId) {
            const firstUserMessage = input.messages.find((message) => message.role === "user");
            const title = (firstUserMessage?.content.trim() || "New Chat").slice(0, 80);
            conversationId = await createConversation(ctx.user.id, input.model, title);
          }
          const latestUserMessage = [...input.messages].reverse().find((message) => message.role === "user");
          if (latestUserMessage) await addChatMessage(conversationId, "user", latestUserMessage.content);
          await addChatMessage(conversationId, "assistant", content, input.model);
        } catch (error) {
          console.warn("[Chat] Could not persist conversation:", error);
        }
        return {
          content,
          model: input.model,
          usage: response.usage,
          conversationId,
        };
      }),
  }),

  analytics: router({
    summary: protectedProcedure.query(({ ctx }) => getUsageSummary(ctx.user.id)),
    byModel: protectedProcedure.query(({ ctx }) => getUsageByModel(ctx.user.id)),
    byDay: protectedProcedure.query(({ ctx }) => getUsageByDay(ctx.user.id)),
    recent: protectedProcedure.query(({ ctx }) => getRecentUsage(ctx.user.id)),
  }),

  chatHistory: router({
    list: protectedProcedure.query(({ ctx }) => getConversationsByUserId(ctx.user.id)),
    messages: protectedProcedure.input(z.object({ conversationId: z.number().int().positive() })).query(({ ctx, input }) =>
      getConversationMessages(ctx.user.id, input.conversationId)
    ),
    search: protectedProcedure.input(z.object({ query: z.string().min(1).max(100) })).query(({ ctx, input }) =>
      searchConversations(ctx.user.id, input.query)
    ),
    updateMessage: protectedProcedure.input(z.object({ messageId: z.number().int().positive(), content: z.string().min(1).max(50000) })).mutation(({ ctx, input }) =>
      updateChatMessage(ctx.user.id, input.messageId, input.content)
    ),
    delete: protectedProcedure.input(z.object({ conversationId: z.number().int().positive() })).mutation(({ ctx, input }) =>
      deleteConversation(ctx.user.id, input.conversationId)
    ),
  }),
});

export type AppRouter = typeof appRouter;

export { tierRank, modelAccess };
export type { SubscriptionTier };

