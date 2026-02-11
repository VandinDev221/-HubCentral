const { Pool } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const url = process.env.DATABASE_URL;
  if (!url) {
    return res.status(500).json({
      ok: false,
      error: 'DATABASE_URL nao definida. Configure em Vercel > Settings > Environment Variables.',
    });
  }

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    await pool.end();
    return res.status(200).json({ ok: true, message: 'Conexao com o banco OK.' });
  } catch (err) {
    await pool.end().catch(() => {});
    return res.status(500).json({
      ok: false,
      error: err.message || 'Erro ao conectar no banco.',
    });
  }
};
