import { credentials, query, json } from '../_shared/supabase.js';

export async function onRequestGet({ env, request }) {
  try {
    const db = credentials(env);
    if (!db) return json({ error: 'Афиша пока не подключена к базе событий.' }, 503);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const params = new URLSearchParams({ select: '*', order: 'sort_order.asc' });
    if (category && category !== 'all') params.set('category', 'eq.' + category);
    const result = await query(db, 'taraz_events?' + params);
    return json(await result.json());
  } catch (error) {
    return json({ error: 'Не удалось загрузить афишу города.' }, 502);
  }
}
