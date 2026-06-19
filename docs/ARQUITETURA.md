# Arquitetura Hub Central

## Visão geral

- **API-first**: frontends consomem apenas a API REST (versionada em `/v1`).
- **Clean Architecture**: separação em domain, application, infrastructure e presentation.
- **Monorepo**: apps (api, admin-web) e packages compartilhados (types, utils, ui-design-system).

## Backend (NestJS)

```
src/
├── domain/           # Entidades e contratos (repositórios)
├── application/      # Casos de uso (services)
│   ├── auth/
│   ├── clients/
│   ├── products/
│   ├── subscriptions/
│   ├── invoices/
│   ├── access/       # GET /v1/access/:clientId
│   ├── dashboard/    # Métricas
│   ├── overdue/      # Suspensão por inadimplência
│   └── billing/      # Geração mensal de faturas
├── infrastructure/
│   ├── prisma/
│   ├── audit/        # AuditLog
│   ├── cron/          # Diário + mensal
│   ├── filters/
│   └── interceptors/
└── presentation/
    ├── auth/         # Login, JWT, guards, roles
    ├── clients/
    ├── products/
    ├── subscriptions/
    ├── invoices/
    ├── access/       # Rota pública para PDV
    └── dashboard/
```

- **Controllers**: só delegam para services e retornam respostas.
- **Regras de negócio**: em `application/*` (services).
- **Persistência**: Prisma (repositório implícito nos services).
- **Segurança**: JWT, Guards, class-validator, bcrypt.

## Fluxo de inadimplência

1. **Cron diário** (2h):
   - Marca faturas vencidas como `overdue`.
   - Para cada fatura `overdue` há mais de 10 dias:
     - Atualiza assinatura para `suspended`.
     - Atualiza cliente para `suspended`.
     - Registra evento em AuditLog (AUTO_BLOCK).

2. **GET /v1/access/:clientId** (uso pelo PDV):
   - Cliente não existe → 404.
   - Cliente `suspended` → `active: false`.
   - Existe fatura `overdue` há mais de 10 dias → `active: false`.
   - Caso contrário → `active: true` e `expiresAt` (próximo vencimento).

## Frontend Admin

- **React** + **Vite** + **React Query** + **React Router**.
- **Design System** em `packages/ui-design-system` (Button, Input, Select, Card, Badge, Modal, Table, Layout).
- **Styled Components** + tokens (colors, typography, spacing, etc.).
- **Storybook** para documentar componentes.

## Diagrama de fluxo (resumo)

```
[Admin] → Cria Cliente → [API] → Prisma
[Admin] → Cria Assinatura (Cliente + Produto) → [API] → Prisma
[Cron mensal] → Gera Invoice para assinaturas ativas
[Cron diário] → Overdue > 10 dias → Suspende Cliente + Assinatura
[PDV] → GET /v1/access/:clientId → active? → Libera ou bloqueia
[Admin] → Marcar fatura paga → Reativa (manual) cliente/assinatura se necessário
```

## Preparação para escala

- **paymentProvider** em Subscription (futuro Stripe/PIX).
- **Webhooks**: estrutura para handlers por evento.
- Módulos isolados para facilitar novos frontends (ex.: app PDV) consumindo a mesma API.
