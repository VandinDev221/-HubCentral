import { useQuery } from '@tanstack/react-query';
import { Card } from '@hub-central/ui-design-system';
import { apiGet } from '../api/client';
import { PageWrapper, PageTitle } from '../components/layout';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

const CardTitle = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
`;

const StyledCard = styled(Card)`
  background: var(--surface);
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

export function Dashboard() {
  const { data, isLoading, error } = useQuery<Metrics>({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => apiGet('/dashboard/metrics'),
  });

  if (isLoading) return <PageWrapper><p>Carregando métricas...</p></PageWrapper>;
  if (error) return <PageWrapper><p>Erro ao carregar métricas.</p></PageWrapper>;
  if (!data) return null;

  return (
    <PageWrapper>
      <PageTitle>Dashboard</PageTitle>
      <Grid>
        <StyledCard>
          <CardTitle>Total de clientes</CardTitle>
          <CardValue>{data.totalClients}</CardValue>
        </StyledCard>
        <StyledCard>
          <CardTitle>Clientes ativos</CardTitle>
          <CardValue>{data.activeClients}</CardValue>
        </StyledCard>
        <StyledCard>
          <CardTitle>Clientes suspensos</CardTitle>
          <CardValue>{data.suspendedClients}</CardValue>
        </StyledCard>
        <StyledCard>
          <CardTitle>Receita do mês</CardTitle>
          <CardValue>{formatBrl(data.monthlyRevenue)}</CardValue>
        </StyledCard>
        <StyledCard>
          <CardTitle>MRR</CardTitle>
          <CardValue>{formatBrl(data.mrr)}</CardValue>
        </StyledCard>
        <StyledCard>
          <CardTitle>Faturas pendentes</CardTitle>
          <CardValue>{data.pendingInvoices}</CardValue>
        </StyledCard>
        <StyledCard>
          <CardTitle>Inadimplentes</CardTitle>
          <CardValue>{data.overdueInvoices}</CardValue>
        </StyledCard>
      </Grid>
    </PageWrapper>
  );
}
