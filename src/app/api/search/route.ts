import { auth } from '@clerk/nextjs/server';
export async function GET(req: Request){const {userId}=await auth(); if(!userId)return Response.json({error:'Unauthorized'},{status:401}); const q=new URL(req.url).searchParams.get('q')?.trim() ?? ''; return Response.json({query:q,results:[]});}
