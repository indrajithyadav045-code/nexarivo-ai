import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const invokeLLMMock = vi.hoisted(() => vi.fn());
vi.mock("./_core/llm", () => ({
  invokeLLM: invokeLLMMock,
}));

function createContext(subscriptionTier: "free" | "starter" | "professional" | "enterprise"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "chat-test-user",
      email: "chat@example.com",
      name: "Chat Test User",
      loginMethod: "manus",
      role: "user",
      subscriptionTier,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("ai.chat", () => {
  beforeEach(() => {
    invokeLLMMock.mockReset();
    invokeLLMMock.mockResolvedValue({
      choices: [{ message: { role: "assistant", content: "Ohm's Law states that voltage equals current multiplied by resistance: V = I × R." } }],
      usage: { prompt_tokens: 10, completion_tokens: 14, total_tokens: 24 },
    });
  });

  it("returns a direct answer to the user's question", async () => {
    const caller = appRouter.createCaller(createContext("free"));
    const result = await caller.ai.chat({
      model: "nexarivo-lite",
      messages: [{ role: "user", content: "What is Ohm's Law?" }],
    });

    expect(result.content).toContain("Ohm's Law");
    expect(result.content).toContain("V = I");
    expect(invokeLLMMock).toHaveBeenCalledOnce();
  });

  it("blocks a model above the user's paid tier", async () => {
    const caller = appRouter.createCaller(createContext("free"));

    await expect(
      caller.ai.chat({
        model: "gpt-4",
        messages: [{ role: "user", content: "Answer this question" }],
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });

    expect(invokeLLMMock).not.toHaveBeenCalled();
  });
});
