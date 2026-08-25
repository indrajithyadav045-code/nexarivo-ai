import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
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

        const response = await invokeLLM({
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

        const content = getTextContent(response.choices?.[0]?.message?.content);
        return {
          content,
          model: input.model,
          usage: response.usage,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

export { tierRank, modelAccess };
export type { SubscriptionTier };

