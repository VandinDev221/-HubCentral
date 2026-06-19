import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Table, Badge, Button, Modal, Input, Select } from '@hub-central/ui-design-system';
import { apiGet, apiPost, apiDelete } from '../api/client';
import { useNotification } from '../contexts/NotificationContext';
import {
  PageWrapper,
  PageTitle,
  PageSubtitle,
  TopActions,
  SearchWrapper,
  SearchInput,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  NewButton,
} from '../components/layout';
import styled from 'styled-components';

const TableCard = styled(Card)`background: var(--surface); overflow-x: auto;`;

interface Inv {
  id: string;
  clientId: string;
  subscriptionId: string;
  amount: number;
  dueDate: string;
  status: string;
  paidAt: string | null;
  client?: { name: string };
  subscription?: { product?: { name: string }; id: string };
}

interface Client {
  id: string;
  name: string;
}

interface Sub {
  id: string;
  clientId: string;
  productId: string;
  price: number;
  status: string;
  client?: { name: string };
  product?: { name: string };
}

export function Invoices() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ clientId: '', subscriptionId: '', amount: '', dueDate: '' });
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Inv | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => apiGet<{ data: Inv[] }>('/invoices?limit=100'),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => apiGet<{ data: Client[] }>('/clients?limit=500'),
  });

  const { data: subsData } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => apiGet<{ data: Sub[] }>('/subscriptions?limit=500'),
  });

  const createMutation = useMutation({
    mutationFn: (body: { clientId: string; subscriptionId: string; amount: number; dueDate: string }) =>
      apiPost<Inv>('/invoices', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setModalOpen(false);
      setForm({ clientId: '', subscriptionId: '', amount: '', dueDate: '' });
      setError('');
      addNotification('Fatura criada com sucesso.', 'success');
    },
    onError: (err: Error) => {
      setError(err.message);
      addNotification(err.message, 'error');
    },
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => apiPost(`/invoices/${id}/pay`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addNotification('Fatura marcada como paga.', 'success');
    },
    onError: (err: Error) => addNotification(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteConfirm(null);
      addNotification('Fatura excluída com sucesso.', 'success');
    },
    onError: (err: Error) => addNotification(err.message, 'error'),
  });

  const clients = clientsData?.data ?? [];
  const subscriptions = subsData?.data ?? [];
  const invoices = data?.data ?? [];
  const filtered = useMemo(() => {
    if (!search.trim()) return invoices;
    const q = search.trim().toLowerCase();
    return invoices.filter(
      (i) => i.client?.name?.toLowerCase().includes(q)
    );
  }, [invoices, search]);
  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));
  const subsByClient = form.clientId
    ? subscriptions.filter((s) => s.clientId === form.clientId && s.status === 'active')
    : [];
  const subscriptionOptions = subsByClient.map((s) => ({
    value: s.id,
    label: `${s.product?.name ?? 'Assinatura'} - R$ ${Number(s.price).toFixed(2)}`,
  }));

  const openCreate = () => {
    setForm({ clientId: '', subscriptionId: '', amount: '', dueDate: '' });
    setError('');
    setModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(String(form.amount).replace(',', '.')) || 0;
    if (!form.clientId || !form.subscriptionId) {
      setError('Selecione cliente e assinatura.');
      return;
    }
    if (amount <= 0) {
      setError('Informe um valor válido.');
      return;
    }
    if (!form.dueDate) {
      setError('Informe a data de vencimento.');
      return;
    }
    createMutation.mutate({
      clientId: form.clientId,
      subscriptionId: form.subscriptionId,
      amount,
      dueDate: form.dueDate,
    });
  };

  const formatBrl = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v));
  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

  const columns = [
    { key: 'client', header: 'Cliente', render: (row: Inv) => row.client?.name ?? '-' },
    { key: 'product', header: 'Produto', render: (row: Inv) => row.subscription?.product?.name ?? '-' },
    { key: 'amount', header: 'Valor', render: (row: Inv) => formatBrl(row.amount) },
    { key: 'dueDate', header: 'Vencimento', render: (row: Inv) => formatDate(row.dueDate) },
    {
      key: 'status',
      header: 'Status',
      render: (row: Inv) => (
        <Badge variant={row.status}>
          {row.status === 'paid' ? 'Pago' : row.status === 'overdue' ? 'Vencido' : 'Pendente'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row: Inv) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {row.status !== 'paid' && (
            <Button size="sm" onClick={() => payMutation.mutate(row.id)} disabled={payMutation.isPending}>
              Marcar pago
            </Button>
          )}
          <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(row)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <PageWrapper><p>Carregando faturas...</p></PageWrapper>;
  if (queryError) return <PageWrapper><p>Erro ao carregar faturas.</p></PageWrapper>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <PageWrapper>
      <PageTitle>Faturas</PageTitle>
      <PageSubtitle>{invoices.length} {invoices.length === 1 ? 'fatura cadastrada' : 'faturas cadastradas'}</PageSubtitle>
      <TopActions>
        <NewButton onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nova Fatura
        </NewButton>
        <SearchWrapper>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <SearchInput placeholder="Buscar fatura..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </SearchWrapper>
      </TopActions>
      {filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg></EmptyIcon>
          <EmptyTitle>Nenhum dado encontrado</EmptyTitle>
          <EmptyText>Não há registros para exibir.</EmptyText>
        </EmptyState>
      ) : (
        <TableCard>
          <Table columns={columns} data={filtered} keyExtractor={(r) => r.id} />
        </TableCard>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova fatura"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSubmit} disabled={createMutation.isPending}>
              Criar
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="Cliente"
            options={clientOptions}
            value={form.clientId}
            onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value, subscriptionId: '' }))}
          />
          <Select
            label="Assinatura"
            options={subscriptionOptions}
            value={form.subscriptionId}
            onChange={(e) => {
              const sub = subsByClient.find((s) => s.id === e.target.value);
              setForm((f) => ({
                ...f,
                subscriptionId: e.target.value,
                amount: sub ? String(sub.price) : f.amount,
              }));
            }}
            disabled={!form.clientId}
          />
          <Input
            label="Valor (R$)"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="0,00"
          />
          <Input
            label="Vencimento"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            min={today}
          />
          {error && <span style={{ color: '#dc2626', fontSize: 14 }}>{error}</span>}
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Excluir fatura?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
              disabled={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p>Tem certeza que deseja excluir esta fatura? Esta ação não pode ser desfeita.</p>
      </Modal>
    </PageWrapper>
  );
}
