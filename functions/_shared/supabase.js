// Supabase credentials are Cloudflare Pages runtime secrets, never embedded in client assets.
export function credentials(env) {
  const url = String(env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = String(env.SUPABASE_SERVICE_ROLE_KEY || '');
  if (!url || !key) return null;
  if (!/^https:\/\//.test(url)) throw new Error('SUPABASE_URL must use HTTPS');
  return { url, key };
}

export async function query(db, endpoint, options = {}) {
  const { method = 'GET', body, prefer = '' } = options;
  const response = await fetch(db.url + '/rest/v1/' + endpoint, {
    method,
    headers: {
      apikey: db.key,
      Authorization: 'Bearer ' + db.key,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error('Supabase request failed (' + response.status + ')');
  return response;
}
export const json = (data, status = 200) => new Response(JSON.stringify(data), {status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
