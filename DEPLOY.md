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

## Deploy da API no Render

1. [render.com](https://render.com) → **New** → **Blueprint**
2. Conectar repositório GitHub
3. Preencher secrets do blueprint: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_ORIGIN`
4. Copiar URL pública após deploy

Comandos (já no `render.yaml`):
- **Build:** `npm run render:build`
- **Start:** `npm run start:api`
- **Health:** `/v1/health`

> **Serviço criado manualmente no Render?** O painel **não** lê o `render.yaml` automaticamente. Em **Settings → Build Command**, cole exatamente: `npm run render:build`

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
4. Copie a **connection string** com `?sslmode=require`.

### Opção B: Neon (neon.tech)

1. Acesse [neon.tech](https://neon.tech) e crie uma conta.
2. Crie um novo projeto e anote a **connection string**.

---

## 2. Variáveis da API

```env
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
PORT=3001
JWT_SECRET=uma-chave-secreta-forte-aqui
JWT_EXPIRES=7d
ADMIN_ORIGIN=https://seu-admin.vercel.app

# Cadastro com Google (mesmo Client ID OAuth no admin e na API)
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com

# E-mail SMTP — sem configurar, códigos aparecem no log da API (dev)
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=Hub Central <noreply@seudominio.com>
```

---

## 3. Rodar migrações no banco da nuvem

```bash
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
```

---

## 4. Onde rodar a API

A **Vercel** hospeda só o **admin**. A **API** roda no **Render** (`render.yaml` na raiz).

Variáveis no Render: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_ORIGIN`, `GOOGLE_CLIENT_ID`, `SMTP_*`, `MAIL_FROM`.

---

## 5. Admin na Vercel

- `VITE_API_URL` = URL da API no Render (sem barra final)
- `VITE_GOOGLE_CLIENT_ID` = mesmo Client ID OAuth usado na API
- **Redeploy obrigatório** após alterar variáveis

### Google Cloud Console (OAuth)

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → **Create OAuth client ID** (Web application).
2. **Authorized JavaScript origins:** `http://localhost:5173` e a URL do admin na Vercel.
3. Copie o Client ID para `GOOGLE_CLIENT_ID` (Render) e `VITE_GOOGLE_CLIENT_ID` (Vercel).

---

## 6. Resumo rápido

1. **Neon** → `DATABASE_URL`
2. **Render** → blueprint + variáveis (+ Google/SMTP para cadastro)
3. **Migrações** → `npm run db:migrate:deploy` (inclui tabela `EmailVerification`)
4. **Vercel** → `VITE_API_URL` + `VITE_GOOGLE_CLIENT_ID` + redeploy
5. **Testar** → `/register` (e-mail + código), login Google, `/login`
