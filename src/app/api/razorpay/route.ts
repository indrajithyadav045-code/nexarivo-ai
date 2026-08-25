import { paymentLinks } from '@/lib/config';
export async function GET(req: Request){const plan=new URL(req.url).searchParams.get('plan') as keyof typeof paymentLinks; const url=paymentLinks[plan]; return url?Response.redirect(url):Response.json({error:'Unknown plan'},{status:400});}
