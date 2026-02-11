import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Table, Button, Modal, Input, Select } from '@hub-central/ui-design-system';
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

interface Product {
  id: string;
  name: string;
  price: number;
  type: string;
}

const PRODUCT_TYPES = [
  { value: 'PDV', label: 'PDV' },
  { value: 'SITE_INSTITUCIONAL', label: 'Site Institucional' },
  { value: 'LOJA_ONLINE', label: 'Loja Online' },
];

const emptyForm = { name: '', price: '', type: 'PDV' };

export function Products() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiGet<Product[]>('/products'),
  });

  const createMutation = useMutation({
    mutationFn: (body: { name: string; price: number; type: string }) =>
      apiPost<Product>('/products', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setModalOpen(false);
      setForm(emptyForm);
      setError('');
      addNotification('Produto criado com sucesso.', 'success');
    },
    onError: (err: Error) => {
      setError(err.message);
      addNotification(err.message, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Product> }) =>
      apiPatch<Product>(`/products/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setError('');
      addNotification('Produto atualizado com sucesso.', 'success');
    },
    onError: (err: Error) => {
      setError(err.message);
      addNotification(err.message, 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteConfirm(null);
      addNotification('Produto excluído com sucesso.', 'success');
    },
    onError: (err: Error) => addNotification(err.message, 'error'),
  });

  const products = data ?? [];
  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.type && p.type.toLowerCase().includes(q))
    );
  }, [products, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (row: Product) => {
    setEditing(row);
    setForm({
      name: row.name,
      price: String(row.price),
      type: row.type,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(String(form.price).replace(',', '.')) || 0;
    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        body: { name: form.name, price: isNaN(price) ? undefined : price, type: form.type },
      });
    } else {
      if (isNaN(price) || price <= 0) {
        setError('Informe um preço válido.');
        return;
      }
      createMutation.mutate({ name: form.name, price, type: form.type });
    }
  };

  const formatBrl = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v));

  const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'type', header: 'Tipo', render: (row: Product) => PRODUCT_TYPES.find((t) => t.value === row.type)?.label ?? row.type },
    { key: 'price', header: 'Preço', render: (row: Product) => formatBrl(row.price) },
    {
      key: 'actions',
      header: '',
      render: (row: Product) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="ghost" onClick={() => openEdit(row)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(row.id)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <PageWrapper><p>Carregando produtos...</p></PageWrapper>;
  if (queryError) return <PageWrapper><p>Erro ao carregar produtos.</p></PageWrapper>;

  return (
    <PageWrapper>
      <PageTitle>Produtos</PageTitle>
      <PageSubtitle>{products.length} {products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}</PageSubtitle>
      <TopActions>
        <NewButton onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Novo Produto
        </NewButton>
        <SearchWrapper>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <SearchInput placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </SearchWrapper>
      </TopActions>
      {filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg></EmptyIcon>
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
        title={editing ? 'Editar produto' : 'Novo produto'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editing ? 'Salvar' : 'Criar'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Preço (R$)"
            type="text"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="0,00"
          />
          <Select
            label="Tipo"
            options={PRODUCT_TYPES}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          />
          {error && <span style={{ color: '#dc2626', fontSize: 14 }}>{error}</span>}
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Excluir produto?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
              disabled={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p>Tem certeza? Esta ação não pode ser desfeita.</p>
      </Modal>
    </PageWrapper>
  );
}
