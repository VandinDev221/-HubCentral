# Produção — Hub Central

Stack: **Admin (Vercel)** + **API (Render)** + **Banco (Neon)**

## Checklist (ordem obrigatória)

### 1. Neon — banco
- [ ] Connection string com `?sslmode=require`
- [ ] Secret `DATABASE_URL` no GitHub (Actions) com a mesma URL

### 2. Render — API
- [ ] Conectar repo → **Blueprint** detecta `render.yaml`
- [ ] Variáveis:
  | Variável | Valor |
  |----------|-------|
  | `DATABASE_URL` | connection string Neon |
  | `JWT_SECRET` | chave forte (ex.: `openssl rand -hex 32`) |
  | `ADMIN_ORIGIN` | URL do admin na Vercel (ex.: `https://seu-app.vercel.app`) |
- [ ] Deploy ok → testar `https://SUA-API.onrender.com/v1/health` → `{ "status": "ok" }`
- [ ] Seed inicial (uma vez): GitHub Actions no push em `main`, ou localmente `npm run db:seed`

### 3. Vercel — admin
- [ ] **Root Directory:** `apps/admin-web`
- [ ] Variável `VITE_API_URL` = URL do Render **sem** barra final
- [ ] **Redeploy** após definir `VITE_API_URL` (valor entra no build)

### 4. Validar login
- URL: seu admin na Vercel
- Credenciais: `admin@hubcentral.com` / `admin123`
- Diagnóstico do banco: `https://seu-app.vercel.app/api/diagnose-login`

---

## Por que não funcionava

| Problema | Efeito |
|----------|--------|
| `start:prod` apontava para `dist/main` (arquivo inexistente) | API caía no Render/Railway |
| `VITE_API_URL` ausente na Vercel | Login chamava a própria Vercel, não a API |
| API só na Vercel (frontend estático) | NestJS não roda na Vercel sem serverless adapter |

---

## Migrações automáticas (GitHub Actions)

Push em `main` → `db:migrate:deploy` + `db:seed` no Neon.

Secret: **Settings → Secrets → Actions → `DATABASE_URL`**

O Render também roda `db:migrate:deploy` no build (redundante, mas seguro).

---

## Rodando local (dev)

```bash
npm run dev:api    # porta 3001
npm run dev:admin  # porta 5173
```

Local não precisa de `VITE_API_URL` — o proxy do Vite encaminha `/v1` para localhost.

---

## Detalhes adicionais

Ver seções abaixo para alternativas de banco (Vercel Postgres / Neon manual) e opções de deploy.

## Deploy da API no Render

1. [render.com](https://render.com) → **New** → **Blueprint**
2. Conectar repositório GitHub
3. Preencher secrets do blueprint: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_ORIGIN`
4. Copiar URL pública após deploy

Comandos (já no `render.yaml`):
- **Build:** `npm install && npm run build:api && npm run db:migrate:deploy`
- **Start:** `npm run start:api`
- **Health:** `/v1/health`

## Admin na Vercel

1. Root Directory = `apps/admin-web`
2. `VITE_API_URL` = `https://hub-central-api.onrender.com` (sua URL real)
3. Redeploy

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
ADMIN_ORIGIN=https://seu-admin.vercel.app
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

A **Vercel** hospeda só o **admin** (frontend estático). A **API** (NestJS) roda no **Render**.

| Serviço   | Uso |
|-----------|-----|
| **Render**  | Web Service na raiz do monorepo (`render.yaml`), `npm run build:api` + `npm run start:api`. |

Variáveis no Render:

- `DATABASE_URL` = connection string do Neon
- `JWT_SECRET` = chave secreta forte
- `ADMIN_ORIGIN` = URL do admin na Vercel (CORS)
- `PORT` = definido automaticamente pelo Render

Depois de publicar, você terá uma URL da API, por exemplo: `https://hub-central-api.onrender.com`.

---

## 5. Admin na Vercel apontando para a API

No projeto do **admin** na Vercel (Settings → Environment Variables):

- `VITE_API_URL` = `https://hub-central-api.onrender.com` (URL real da API no Render)

No código, `import.meta.env.VITE_API_URL` é usada em `AuthContext` e `api/client.ts`. **Redeploy obrigatório** após alterar.

---

## 6. Resumo rápido

1. **Criar banco**: Neon → `DATABASE_URL`
2. **Render**: blueprint + `DATABASE_URL`, `JWT_SECRET`, `ADMIN_ORIGIN`
3. **Migrar/seed**: GitHub Actions ou manual
4. **Vercel**: Root `apps/admin-web`, `VITE_API_URL`, redeploy
5. **Testar**: `/v1/health` na API + login no admin
