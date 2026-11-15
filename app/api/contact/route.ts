import { getDb } from '../../../db/index';
export const runtime = 'nodejs';
export async function POST(request: Request) {
 const origin = request.headers.get('Origin');
 if (origin && origin !== new URL(request.url).origin) return Response.json({error:'This request is not allowed.'},{status:403});
 if (Number(request.headers.get('Content-Length') || 0) > 12000) return Response.json({error:'Message is too long.'},{status:413});
 let body: Record<string, unknown>;
 try { const raw = await request.text(); if(raw.length > 12000) return Response.json({error:'Message is too long.'},{status:413}); body = JSON.parse(raw); if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error(); } catch { return Response.json({error:'Please provide a valid message.'},{status:400}); }
 const read = (key: string) => typeof body[key] === 'string' ? (body[key] as string).trim() : '';
 const name = read('name'), email = read('email').toLowerCase(), subject = read('subject'), message = read('message');
 if (read('website')) return Response.json({ok:true});
 if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120 || !subject || subject.length > 160 || message.length < 10 || message.length > 5000) return Response.json({error:'Check every field. Use a valid email and a message between 10 and 5,000 characters.'},{status:400});
 try { const db = getDb(); const recent = await db.recentMessages(email, Date.now()-60000); if(recent.length) return Response.json({error:'Your previous message was saved. Please wait a minute before sending another.'},{status:429}); await db.saveMessage({id:crypto.randomUUID(),name,email,subject,message,createdAt:Date.now()}); return Response.json({ok:true},{status:201}); } catch { return Response.json({error:'The inbox is temporarily unavailable. Your message has not been sent. Please use the email link or try again shortly.'},{status:503}); }
}
