import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Table, Badge, Button, Modal, Input } from '@hub-central/ui-design-system';
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
import type { Column } from '@hub-central/ui-design-system';
import styled from 'styled-components';

const TableCard = styled(Card)`
  background: var(--surface);
  overflow-x: auto;
`;

interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
}

const emptyForm = { name: '', document: '', email: '', phone: '' };

export function Clients() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['clients'],
    queryFn: () => apiGet<{ data: Client[] }>('/clients?limit=100'),
  });

  const clients = data?.data ?? [];
  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.trim().toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.document && c.document.replace(/\D/g, '').includes(q.replace(/\D/g, '')))
    );
  }, [clients, search]);

  const createMutation = useMutation({
    mutationFn: (body: typeof emptyForm) => apiPost<Client>('/clients', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setModalOpen(false);
      setForm(emptyForm);
      setError('');
      addNotification('Cliente criado com sucesso.', 'success');
    },
    onError: (err: Error) => {
      setError(err.message);
      addNotification(err.message, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Client> }) =>
      apiPatch<Client>(`/clients/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setError('');
      addNotification('Cliente atualizado com sucesso.', 'success');
    },
    onError: (err: Error) => {
      setError(err.message);
      addNotification(err.message, 'error');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiPatch(`/clients/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addNotification('Status do cliente atualizado.', 'success');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteConfirm(null);
      addNotification('Cliente excluído com sucesso.', 'success');
    },
    onError: (err: Error) => addNotification(err.message, 'error'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (row: Client) => {
    setEditing(row);
    setForm({
      name: row.name,
      document: row.document,
      email: row.email,
      phone: row.phone ?? '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        body: { name: form.name, document: form.document, email: form.email, phone: form.phone || undefined },
      });
    } else {
      createMutation.mutate(form);
    }
  };

  if (isLoading) return <PageWrapper><p>Carregando clientes...</p></PageWrapper>;
  if (queryError) return <PageWrapper><p>Erro ao carregar clientes.</p></PageWrapper>;

  const columns: Column<Client>[] = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
    { key: 'document', header: 'Documento' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'active' : 'suspended'}>
          {row.status === 'active' ? 'Ativo' : 'Suspenso'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button size="sm" variant="ghost" onClick={() => openEdit(row)}>Editar</Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              statusMutation.mutate({
                id: row.id,
                status: row.status === 'active' ? 'suspended' : 'active',
              })
            }
            disabled={statusMutation.isPending}
          >
            {row.status === 'active' ? 'Suspender' : 'Ativar'}
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(row)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper>
      <PageTitle>Clientes</PageTitle>
      <PageSubtitle>{clients.length} {clients.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}</PageSubtitle>

      <TopActions>
        <NewButton onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Cliente
        </NewButton>
        <SearchWrapper>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <SearchInput
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchWrapper>
      </TopActions>

      {filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </EmptyIcon>
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
        title={editing ? 'Editar cliente' : 'Novo cliente'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Salvar' : 'Criar'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Nome" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="Documento (CPF/CNPJ)" value={form.document} onChange={(e) => setForm((f) => ({ ...f, document: e.target.value }))} required />
          <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          <Input label="Telefone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          {error && <span style={{ color: '#dc2626', fontSize: 14 }}>{error}</span>}
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Excluir cliente?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="danger" onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)} disabled={deleteMutation.isPending}>
              Excluir
            </Button>
          </>
        }
      >
        <p>Tem certeza que deseja excluir <strong>{deleteConfirm?.name}</strong>? Assinaturas e faturas vinculadas também serão removidas.</p>
      </Modal>
    </PageWrapper>
  );
}
