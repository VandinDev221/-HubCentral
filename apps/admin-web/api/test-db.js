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

    let migrationsRun = false;
    let lastMigrations = [];

    try {
      const rows = await sql`SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 10`;
      migrationsRun = Array.isArray(rows) && rows.length > 0;
      lastMigrations = (rows || []).map((r) => ({ name: r.migration_name, at: r.finished_at }));
    } catch (_) {
      // Tabela _prisma_migrations nao existe = migracoes nunca rodaram
    }

    return res.status(200).json({
      ok: true,
      message: 'Conexao com o banco OK.',
      migrationsRun,
      lastMigrations,
    });
  } catch (err) {
    const msg = err?.message || String(err);
    return res.status(500).json({
      ok: false,
      error: msg,
    });
  }
}
