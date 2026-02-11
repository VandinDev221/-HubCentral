import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      return res.status(500).json({
        ok: false,
        error: 'DATABASE_URL nao definida. Configure em Vercel > Settings > Environment Variables.',
      });
    }

    const sql = neon(url);
    await sql('SELECT 1');

    return res.status(200).json({ ok: true, message: 'Conexao com o banco OK.' });
  } catch (err) {
    const msg = err?.message || String(err);
    return res.status(500).json({
      ok: false,
      error: msg,
    });
  }
}
