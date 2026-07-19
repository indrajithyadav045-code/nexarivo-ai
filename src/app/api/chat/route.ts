import { auth } from '@clerk/nextjs/server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { chatRequestSchema } from '@/lib/config';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = chatRequestSchema.parse(await req.json());
  const selected = body.model.includes('claude') ? anthropic('claude-3-5-sonnet-latest') : body.model.includes('gemini') ? google('gemini-2.0-flash') : openai('gpt-4o-mini');
  const result = streamText({ model: selected, system: `You are NEXARIVO ${body.agent ?? 'AI'}, a precise premium SaaS assistant.`, messages: body.messages });
  return result.toDataStreamResponse();
}
