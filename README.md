# NEXARIVO

NEXARIVO is a production-oriented AI SaaS platform built with Next.js 15, React 19, TypeScript, TailwindCSS, Clerk, Prisma, Supabase PostgreSQL/Storage, Razorpay payment links, and AI SDK providers.

## Features
- Premium dark-first landing page with hero, AI preview, features, agents, pricing, FAQ, CTA, and footer.
- Clerk-protected dashboard shell with sidebar, global search entry, chats, agents, documents, projects, settings, usage, billing, and admin sections.
- Streaming chat route with provider routing for OpenAI, Anthropic, and Google models.
- Prisma schema for users, plans, projects, folders, conversations, messages, documents, usage, and feedback.
- Razorpay payment links for Pro, Premium, and Enterprise plans without subscription integration.

## Setup
1. Copy `.env.example` to `.env.local` and fill Clerk, Supabase, database, and AI provider keys.
2. Run `npm install`.
3. Run `npx prisma generate && npx prisma db push`.
4. Run `npm run dev`.

## Deployment
Deploy to Vercel, add the same environment variables, and connect the Supabase PostgreSQL database URL.
