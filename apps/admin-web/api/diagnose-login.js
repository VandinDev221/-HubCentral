import { neon } from '@neondatabase/serverless';

/**
 * Rota de diagnóstico do login.
 * Acesse: https://seu-app.vercel.app/api/diagnose-login
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const result = {
    ok: true,
    checks: {},
    problemas: [],
    dicas: [],
  };

  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      result.ok = false;
      result.problemas.push('DATABASE_URL nao definida na Vercel (Settings > Environment Variables).');
      result.dicas.push('Adicione DATABASE_URL com a connection string do Neon.');
      return res.status(200).json(result);
    }
    result.checks.DATABASE_URL = 'definida';

    const sql = neon(url);

    // 1. Conexão
    try {
      await sql('SELECT 1');
      result.checks.conexao = 'OK';
    } catch (e) {
      result.ok = false;
      result.checks.conexao = 'FALHOU';
      result.problemas.push('Nao foi possivel conectar no banco: ' + (e?.message || e));
      return res.status(200).json(result);
    }

    // 2. Tabela User existe?
    let userCount = 0;
    let adminExiste = false;
    try {
      const countRows = await sql`SELECT COUNT(*)::int as total FROM "User"`;
      userCount = countRows?.[0]?.total ?? 0;
      result.checks.tabelaUser = 'existe';
      result.checks.totalUsuarios = userCount;
    } catch (e) {
      result.checks.tabelaUser = 'NAO existe ou erro';
      result.problemas.push('Tabela User nao encontrada. Rode as migracoes: npm run db:migrate:deploy');
      result.dicas.push('No GitHub: confira se o secret DATABASE_URL esta correto e se o workflow Deploy DB rodou.');
    }

    // 3. Usuário admin@hubcentral.com existe?
    if (userCount > 0) {
      try {
        const adminRows = await sql`SELECT id, email, role FROM "User" WHERE email = 'admin@hubcentral.com'`;
        adminExiste = Array.isArray(adminRows) && adminRows.length > 0;
        result.checks.adminExiste = adminExiste;
        if (adminExiste) {
          result.checks.adminEmail = adminRows[0].email;
          result.checks.adminRole = adminRows[0].role;
        }
      } catch (e) {
        result.checks.adminExiste = 'erro ao verificar';
        result.problemas.push('Erro ao buscar admin: ' + (e?.message || e));
      }
    }

    if (!adminExiste && result.checks.tabelaUser === 'existe') {
      result.problemas.push('Usuario admin@hubcentral.com NAO existe no banco.');
      result.dicas.push('Rode o seed: npm run db:seed (com DATABASE_URL no .env da API). Ou confira o workflow GitHub Actions.');
    }

    // 4. Onde você está fazendo login?
    result.dicas.push('Se o login e no SITE DA VERCEL: a API (NestJS) precisa estar no ar e VITE_API_URL no projeto Vercel deve apontar para ela.');
    result.dicas.push('Se o login e no LOCALHOST: rode npm run dev:api e use o mesmo DATABASE_URL no apps/api/.env.');

    return res.status(200).json(result);
  } catch (err) {
    result.ok = false;
    result.problemas.push(err?.message || String(err));
    return res.status(200).json(result);
  }
}
