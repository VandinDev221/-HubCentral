import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'Design System/Badge',
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Active: Story = { args: { children: 'Ativo', variant: 'active' } };
export const Suspended: Story = { args: { children: 'Suspenso', variant: 'suspended' } };
export const Pending: Story = { args: { children: 'Pendente', variant: 'pending' } };
export const Overdue: Story = { args: { children: 'Vencido', variant: 'overdue' } };
export const Paid: Story = { args: { children: 'Pago', variant: 'paid' } };
