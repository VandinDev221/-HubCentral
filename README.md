# Hub Central SaaS

Sistema SaaS de **Clientes e Faturamento**: gestão de clientes, assinaturas, faturas, inadimplência e bloqueio automático. API-first, multi-frontend, preparado para escala.

## Arquitetura

- **Backend**: NestJS + TypeScript + PostgreSQL + Prisma  
- **Admin**: React + Vite + React Query + Design System (Styled Components)  
- **Monorepo**: `apps/api`, `apps/admin-web`, `packages/types`, `packages/utils`, `packages/ui-design-system`

### Camadas (Clean Architecture)

- **domain**: entidades e interfaces de repositórios  
- **application**: use cases / serviços de aplicação  
- **infrastructure**: Prisma, audit, cron, filters  
- **presentation**: controllers, DTOs, guards, estratégias JWT  

## Pré-requisitos

- Node.js 18+
- Docker (opcional, para PostgreSQL)
- npm ou yarn

## Setup local

### 1. Banco de dados (Docker)

```bash
cd hub-central
docker-compose up -d
```

Ou use um PostgreSQL local com:

- Database: `hub_central`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

### 2. Variáveis de ambiente (API)

```bash
cp apps/api/.env.example apps/api/.env
# Ajuste DATABASE_URL se necessário
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Prisma (migrar e seed)

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Rodar API e Admin

**API** (porta 3000):

```bash
npm run dev:api
```

**Admin** (porta 5173):

```bash
npm run dev:admin
```

Ou ambos:

```bash
npm run dev
```

### 6. Acesso

- **Admin**: http://localhost:5173  
- **Login**: `admin@hubcentral.com` / `admin123`  
- **API Swagger**: http://localhost:3000/api/docs  

## Estrutura do monorepo

```
hub-central/
├── apps/
│   ├── api/                 # NestJS API
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── application/   # use cases
│   │       ├── domain/
│   │       ├── infrastructure/
│   │       └── presentation/
│   └── admin-web/           # React admin (Vite)
├── packages/
│   ├── types/               # tipos compartilhados
│   ├── utils/               # helpers (moeda, data, validação)
│   └── ui-design-system/    # componentes + Storybook
├── docker-compose.yml
└── package.json
```

## Regras de negócio

### Inadimplência

- Fatura **vencida** (dueDate &lt; hoje) → status `overdue`.  
- Fatura **overdue há mais de 10 dias** → assinatura e cliente passam para `suspended` (bloqueio automático).

### Endpoint de validação (PDV)

- **GET** `/v1/access/:clientId`  
- Resposta: `{ "active": true | false, "expiresAt": "YYYY-MM-DD" | null, "reason"?: string }`  
- Usado pelo PDV para liberar ou bloquear acesso.

### Cron

- **Diário** (2h): atualiza faturas para `overdue` e aplica suspensão (overdue &gt; 10 dias).  
- **Mensal** (dia 1, 3h): gera faturas para assinaturas ativas (próximo ciclo).

## Design System e Storybook

```bash
npm run storybook
```

Documentação dos componentes em http://localhost:6006.

## Segurança

- Senhas com **bcrypt**  
- **JWT** para sessão admin  
- **class-validator** nos DTOs  
- Guards (JWT + Roles) nas rotas protegidas  
- API versionada em **/v1**  

## Logs (Audit)

Eventos registrados em `AuditLog`: criação de fatura, pagamento, bloqueio automático, desbloqueio.

## Escala e integrações futuras

- Campo `paymentProvider` em assinaturas (Stripe, PIX, etc.).  
- Estrutura preparada para webhooks (handlers por evento).  
- Código modular para adicionar novos frontends (ex.: app PDV) consumindo a mesma API.

## Comandos úteis

| Comando            | Descrição                    |
|--------------------|------------------------------|
| `npm run dev`      | API + Admin em paralelo      |
| `npm run dev:api`  | Só a API                     |
| `npm run dev:admin`| Só o Admin                   |
| `npm run db:studio`| Prisma Studio (UI do banco)  |
| `npm run storybook`| Storybook do design system   |
| `npm run docker:up`| Sobe PostgreSQL com Docker   |

## Diagrama de fluxo (resumo)

1. **Cliente** é criado no admin.  
2. **Produtos** (ex.: PDV, Site) têm preço e tipo.  
3. **Assinatura** liga cliente + produto (uma ativa por produto por cliente).  
4. **Faturas** são geradas (manual ou pelo cron mensal).  
5. Fatura **overdue &gt; 10 dias** → cron suspende assinatura e cliente.  
6. **PDV** chama `GET /v1/access/:clientId`; se `active: false`, bloqueia acesso.  
7. Pagamento registrado no admin → fatura `paid`; desbloqueio manual (reativar cliente/assinatura) quando aplicável.

---

Projeto gerado com base em prompt SaaS profissional (Clean Architecture, API-first, multi-frontend).
