import { z } from 'zod';
const schema=z.object({message:z.string().min(3),rating:z.number().min(1).max(5).optional()});
export async function POST(req:Request){const data=schema.parse(await req.json()); return Response.json({ok:true,feedback:data});}
