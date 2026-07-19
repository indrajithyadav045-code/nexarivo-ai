import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = { title: 'NEXARIVO — One AI Platform. Infinite Possibilities.', description: 'Premium AI SaaS workspace for chat, research, documents, projects, and agents.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <ClerkProvider><html lang="en"><body>{children}</body></html></ClerkProvider>; }
