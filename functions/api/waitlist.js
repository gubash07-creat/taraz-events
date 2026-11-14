import { credentials, query, json } from '../_shared/supabase.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
async function count(db) {
  const response = await query(db, 'taraz_waitlist?select=id', {prefer:'count=exact'});
  const header = response.headers.get('content-range') || '';
  const match = header.match(/\/(\d+)$/);
  return match ? Number(match[1]) : (await response.json()).length;
}
export async function onRequestGet({ env }) {
  try {
    const db = credentials(env);
    if (!db) return json({ error: 'Лист ожидания ещё не подключён.' }, 503);
    return json({ count: await count(db) });
  } catch { return json({ error: 'Не удалось получить список ожидания.' }, 502); }
}
export async function onRequestPost({ env, request }) {
  try {
    const db = credentials(env);
    if (!db) return json({ error: 'Регистрация пока недоступна. Попробуйте позднее.' }, 503);
    if (Number(request.headers.get('content-length') || 0) > 4096) return json({error:'Запрос слишком большой'},413);
    let body;
    try { body = await request.json(); } catch { return json({error:'Неверный формат запроса'},400); }
    const email = String(body?.email || '').trim().toLowerCase();
    const interest = String(body?.interest || '').trim().slice(0, 120);
    if (!EMAIL.test(email) || email.length > 254) return json({error:'Проверьте e-mail: нужен адрес вида name@example.com'},400);
    const existingResponse = await query(db, 'taraz_waitlist?select=id&email=eq.'+encodeURIComponent(email)+'&limit=1');
    const existing = await existingResponse.json();
    if (existing.length) return json({already:true,position:await count(db)});
    // Unique index on email is recommended to avoid duplicates under concurrency.
    await query(db, 'taraz_waitlist', {method:'POST',body:{email,interest},prefer:'return=minimal'});
    return json({already:false,email,position:await count(db)},201);
  } catch { return json({error:'Не удалось отправить заявку. Попробуйте позднее.'},502); }
}
