import { z } from 'zod';

export const paymentLinks = {
  pro: 'https://rzp.io/rzp/NJb668Hn',
  premium: 'https://rzp.io/rzp/GDVQhre',
  enterprise: 'https://rzp.io/rzp/gWsg13q',
} as const;

export const models = [
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', strengths: 'Reasoning, code, writing' },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', strengths: 'Long-form analysis' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', strengths: 'Multimodal research' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'OpenRouter', strengths: 'Fast engineering help' },
] as const;

export const agents = [
  'Coding Agent','Research Agent','Writing Agent','Business Agent','Presentation Agent','Marketing Agent','Resume Agent','Document Agent',
] as const;

export const chatRequestSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string().min(1) })),
  model: z.string().default('gpt-4.1'),
  agent: z.string().optional(),
});
