import { useQuery } from '@tanstack/react-query';
import { Card } from '@hub-central/ui-design-system';
import { apiGet } from '../api/client';
import { PageWrapper, PageTitle, PageSubtitle } from '../components/layout';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const MetricCard = styled(Card)<{ $accent?: string }>`
  background: var(--surface);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $accent }: { $accent?: string }) => $accent || 'var(--primary)'};
    opacity: 0.85;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const CardTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: -0.01em;
`;

const IconWrap = styled.div<{ $bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
`;

const CardValue = styled.div`
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
  line-height: 1.2;
`;

interface Metrics {
  totalClients: number;
  activeClients: number;
  suspendedClients: number;
  monthlyRevenue: number;
  mrr: number;
  pendingInvoices: number;
  overdueInvoices: number;
}

function formatBrl(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const metricsConfig = [
  { key: 'totalClients' as const, label: 'Total de clientes', accent: '#6366f1', icon: 'people' },
  { key: 'activeClients' as const, label: 'Clientes ativos', accent: '#059669', icon: 'check' },
  { key: 'suspendedClients' as const, label: 'Suspensos', accent: '#d97706', icon: 'pause' },
  { key: 'monthlyRevenue' as const, label: 'Receita do mês', accent: '#06b6d4', format: 'brl' },
  { key: 'mrr' as const, label: 'MRR', accent: '#8b5cf6', format: 'brl' },
  { key: 'pendingInvoices' as const, label: 'Faturas pendentes', accent: '#64748b', icon: 'clock' },
  { key: 'overdueInvoices' as const, label: 'Inadimplentes', accent: '#dc2626', icon: 'alert' },
];

const icons: Record<string, JSX.Element> = {
  people: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  pause: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="10" y1="15" x2="10" y2="9" />
      <line x1="14" y1="15" x2="14" y2="9" />
    </svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  alert: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  brl: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
};

export function Dashboard() {
  const { data, isLoading, error } = useQuery<Metrics>({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => apiGet('/dashboard/metrics'),
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Carregando métricas...</PageSubtitle>
      </PageWrapper>
    );
  }
  if (error) {
    return (
      <PageWrapper>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Erro ao carregar métricas.</PageSubtitle>
      </PageWrapper>
    );
  }
  if (!data) return null;

  return (
    <PageWrapper>
      <PageTitle>Dashboard</PageTitle>
      <PageSubtitle>Visão geral do seu negócio SaaS</PageSubtitle>
      <Grid>
        {metricsConfig.map((m) => {
          const raw = data[m.key];
          const value = m.format === 'brl' ? formatBrl(raw as number) : String(raw);
          const iconKey = m.format === 'brl' ? 'brl' : m.icon || 'people';
          return (
            <MetricCard key={m.key} hoverable $accent={m.accent}>
              <CardTop>
                <CardTitle>{m.label}</CardTitle>
                <IconWrap $bg={`${m.accent}18`}>{icons[iconKey]}</IconWrap>
              </CardTop>
              <CardValue>{value}</CardValue>
            </MetricCard>
          );
        })}
      </Grid>
    </PageWrapper>
  );
}
