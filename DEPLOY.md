# Deploy Hub Central (Vercel + banco)

## Migrações + seed no Neon a cada push (GitHub Actions)

Ao dar **push na branch `main`**, o GitHub Actions roda automaticamente no Neon:

- `db:generate`
- `db:migrate:deploy`
- `db:seed`

**Configurar uma vez:** no repositório no GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** → nome: `DATABASE_URL`, valor: sua connection string do Neon (a mesma do `.env` da API).

---

## Rodando só na sua máquina (sem Railway, sem Vercel)

Não precisa configurar nada. Na pasta do projeto:

```bash
npm run dev:api    # terminal 1 – API na porta 3001
npm run dev:admin  # terminal 2 – Admin na porta 5173
```

Abra **http://localhost:5173**. O admin usa o proxy e fala com a API no localhost. Banco: use o `.env` da API (PostgreSQL local ou Neon).

---

## Admin na Vercel + API em algum lugar (Railway, Render, etc.)

Se você subir o **admin** na Vercel e a **API** em outro serviço (Railway, Render, Fly.io):

1. **Vercel** → projeto do admin → **Settings** → **Environment Variables**
2. Adicione: `VITE_API_URL` = URL pública da sua API (ex: `https://sua-api.onrender.com`) — **sem** barra no final
3. **Redeploy** do admin

---

## 1. Criar o banco de dados (PostgreSQL na nuvem)

### Opção A: Vercel Postgres (no próprio painel da Vercel)

1. Acesse [vercel.com](https://vercel.com) → seu projeto **Hub Central** (o do admin).
2. Aba **Storage** → **Create Database** → escolha **Postgres** (Vercel Postgres, powered by Neon).
3. Crie o banco (região próxima a você).
4. Na aba **.env.local** (ou **Settings → Environment Variables**), a Vercel já deve ter criado algo como:
   - `POSTGRES_URL` ou `DATABASE_URL`
   - Copie a **connection string** que termina com `?sslmode=require` (obrigatório para conexão segura).

### Opção B: Neon (neon.tech)

1. Acesse [neon.tech](https://neon.tech) e crie uma conta.
2. Crie um novo projeto e anote a **connection string** (formato `postgresql://user:pass@host/dbname?sslmode=require`).

---

## 2. Usar a URL do banco na API (local ou servidor)

A **API** (NestJS) precisa da variável `DATABASE_URL` apontando para esse banco.

- No **apps/api**, crie ou edite o `.env` e defina:

```env
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
PORT=3001
JWT_SECRET=uma-chave-secreta-forte-aqui
JWT_EXPIRES=7d
```

Substitua pela connection string que a Vercel ou o Neon forneceram (geralmente já vem com `?sslmode=require`).

---

## 3. Rodar migrações no banco da nuvem

Com o `DATABASE_URL` apontando para o banco criado (no `.env` da API):

```bash
cd hub-central
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
```

- `db:migrate:deploy`: aplica as migrações no banco de produção (sem criar novas).
- `db:seed`: cria o usuário admin e dados iniciais (ex.: `admin@hubcentral.com` / `admin123`).

---

## 4. Onde rodar a API

A **Vercel** está hospedando só o **admin** (frontend estático). A **API** (NestJS) precisa rodar em outro lugar e usar o mesmo `DATABASE_URL`.

Sugestões:

| Serviço   | Uso |
|-----------|-----|
| **Railway** | Conectar o repo, apontar para `apps/api`, definir `DATABASE_URL` e comando `npm run build -w @hub-central/api && npm run start:prod -w @hub-central/api` (ou equivalente). |
| **Render**  | Web Service, build na pasta da API, mesmo `DATABASE_URL`. |
| **Fly.io**  | Deploy do app Node na pasta da API com o mesmo `.env`. |

Em todos, defina as variáveis:

- `DATABASE_URL` = connection string do passo 1  
- `JWT_SECRET` = mesma chave que você usar no admin  
- `PORT` = o que o serviço exigir (ex.: 3001 ou a porta padrão do Render/Railway)

Depois de publicar, você terá uma URL da API, por exemplo: `https://sua-api.railway.app` ou `https://sua-api.onrender.com`.

---

## 5. Admin na Vercel apontando para a API

O admin (já na Vercel) precisa chamar a **API** na URL pública.

- Se o admin usa **proxy** para `/v1` e `/api` (ex.: no `vite.config.ts`), em produção isso não existe: as chamadas precisam ir para a URL real da API.

**Opção 1 – Variável de ambiente no build (recomendado)**  
No projeto do **admin** na Vercel (Settings → Environment Variables), defina por exemplo:

- `VITE_API_URL` = `https://sua-api.railway.app` (ou a URL da sua API)

No código do admin, use `import.meta.env.VITE_API_URL` como base das requisições (ex.: em um `axios.create` ou `fetch`). Assim o build da Vercel já embute a URL correta.

**Opção 2 – Rewrites na Vercel**  
Se quiser que o mesmo domínio do admin sirva as chamadas de API, use **Rewrites** no `vercel.json` do admin para redirecionar `/v1` e `/api` para a URL da API. Isso exige que a API suporte CORS para o domínio do admin.

---

## 6. Resumo rápido

1. **Criar banco**: Vercel Postgres ou Neon → obter `DATABASE_URL` (com `?sslmode=require`).
2. **API**: em `apps/api/.env` colocar `DATABASE_URL` (e `JWT_SECRET`, `PORT`).
3. **Migrar e seed**: `npm run db:generate`, `npm run db:migrate:deploy`, `npm run db:seed`.
4. **Deploy da API**: Railway / Render / Fly.io com o mesmo `DATABASE_URL`.
5. **Admin na Vercel**: definir `VITE_API_URL` (ou rewrites) para a URL da API.

Depois disso, o admin na Vercel usa o banco na nuvem através da API que você deployou.
