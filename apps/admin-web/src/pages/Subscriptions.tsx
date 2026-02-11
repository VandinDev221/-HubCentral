import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Table, Badge, Button, Modal, Input, Select } from '@hub-central/ui-design-system';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/client';
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

interface Sub {
  id: string;
  clientId: string;
  productId: string;
  price: number;
  status: string;
  startDate: string;
  nextBillingDate: string;
  client?: { name: string };
  product?: { name: string };
}

interface Client {
  id: string;
  name: string;
  status: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  type: string;
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativa' },
  { value: 'suspended', label: 'Suspensa' },
  { value: 'cancelled', label: 'Cancelada' },
];

export function Subscriptions() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editing, setEditing] = useState<Sub | null>(null);
  const [form, setForm] = useState({ clientId: '', productId: '', price: '' });
  const [editForm, setEditForm] = useState({ status: 'active', price: '' });
  const [error, setError] = useState('');
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => apiGet<{ data: Sub[] }>('/subscriptions?limit=100'),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => apiGet<{ data: Client[] }>('/clients?limit=500'),
  });

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiGet<Product[]>('/products'),
  });

  const createMutation = useMutation({
    mutationFn: (body: { clientId: string; productId: string; price: number }) =>
      apiPost<Sub>('/subscriptions', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setModalOpen(false);
      setForm({ clientId: '', productId: '', price: '' });
      setError('');
      addNotification('Assinatura criada com sucesso.', 'success');
    },
    onError: (err: Error) => {
      setError(err.message);
      addNotification(err.message, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status?: string; price?: number } }) =>
      apiPatch<Sub>(`/subscriptions/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setEditModalOpen(false);
      setEditing(null);
      setError('');
      addNotification('Assinatura atualizada com sucesso.', 'success');
    },
    onError: (err: Error) => {
      setError(err.message);
      addNotification(err.message, 'error');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/subscriptions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setCancelConfirm(null);
      addNotification('Assinatura excluída com sucesso.', 'success');
    },
    onError: (err: Error) => addNotification(err.message, 'error'),
  });

  const clients = clientsData?.data?.filter((c) => c.status === 'active') ?? [];
  const products = productsData ?? [];
  const subs = data?.data ?? [];
  const filtered = useMemo(() => {
    if (!search.trim()) return subs;
    const q = search.trim().toLowerCase();
    return subs.filter(
      (s) =>
        s.client?.name?.toLowerCase().includes(q) ||
        s.product?.name?.toLowerCase().includes(q)
    );
  }, [subs, search]);
  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));
  const productOptions = products.map((p) => ({ value: p.id, label: `${p.name} (${p.price})` }));

  const openCreate = () => {
    setForm({ clientId: '', productId: '', price: '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (row: Sub) => {
    setEditing(row);
    setEditForm({ status: row.status, price: String(row.price) });
    setError('');
    setEditModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(String(form.price).replace(',', '.')) || 0;
    if (!form.clientId || !form.productId) {
      setError('Selecione cliente e produto.');
      return;
    }
    if (price <= 0) {
      setError('Informe um preço válido.');
      return;
    }
    createMutation.mutate({
      clientId: form.clientId,
      productId: form.productId,
      price,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const price = parseFloat(String(editForm.price).replace(',', '.'));
    updateMutation.mutate({
      id: editing.id,
      body: {
        status: editForm.status,
        ...(isNaN(price) ? {} : { price }),
      },
    });
  };

  const formatBrl = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v));
  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

  const columns = [
    { key: 'client', header: 'Cliente', render: (row: Sub) => row.client?.name ?? '-' },
    { key: 'product', header: 'Produto', render: (row: Sub) => row.product?.name ?? '-' },
    { key: 'price', header: 'Preço', render: (row: Sub) => formatBrl(row.price) },
    { key: 'status', header: 'Status', render: (row: Sub) => <Badge variant={row.status}>{row.status}</Badge> },
    { key: 'nextBillingDate', header: 'Próximo venc.', render: (row: Sub) => formatDate(row.nextBillingDate) },
    {
      key: 'actions',
      header: '',
      render: (row: Sub) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="ghost" onClick={() => openEdit(row)} disabled={row.status === 'cancelled'}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => setCancelConfirm(row.id)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <PageWrapper><p>Carregando assinaturas...</p></PageWrapper>;
  if (queryError) return <PageWrapper><p>Erro ao carregar assinaturas.</p></PageWrapper>;

  return (
    <PageWrapper>
      <PageTitle>Assinaturas</PageTitle>
      <PageSubtitle>{subs.length} {subs.length === 1 ? 'assinatura cadastrada' : 'assinaturas cadastradas'}</PageSubtitle>
      <TopActions>
        <NewButton onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nova Assinatura
        </NewButton>
        <SearchWrapper>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <SearchInput placeholder="Buscar assinatura..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </SearchWrapper>
      </TopActions>
      {filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg></EmptyIcon>
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
        title="Nova assinatura"
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
            onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
          />
          <Select
            label="Produto"
            options={productOptions}
            value={form.productId}
            onChange={(e) => {
              const prod = products.find((p) => p.id === e.target.value);
              setForm((f) => ({
                ...f,
                productId: e.target.value,
                price: prod ? String(prod.price) : f.price,
              }));
            }}
          />
          <Input
            label="Preço (R$)"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="0,00"
          />
          {error && <span style={{ color: '#dc2626', fontSize: 14 }}>{error}</span>}
        </form>
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar assinatura"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit} disabled={updateMutation.isPending}>
              Salvar
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={editForm.status}
            onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
          />
          <Input
            label="Preço (R$)"
            value={editForm.price}
            onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
          />
          {error && <span style={{ color: '#dc2626', fontSize: 14 }}>{error}</span>}
        </form>
      </Modal>

      <Modal
        open={!!cancelConfirm}
        onClose={() => setCancelConfirm(null)}
        title="Excluir assinatura?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => cancelConfirm && cancelMutation.mutate(cancelConfirm)}
              disabled={cancelMutation.isPending}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p>Tem certeza? A assinatura e as faturas vinculadas serão removidas permanentemente.</p>
      </Modal>
    </PageWrapper>
  );
}
