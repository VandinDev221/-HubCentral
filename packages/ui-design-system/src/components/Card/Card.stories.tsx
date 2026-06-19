import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Design System/Card',
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { children: 'Conteúdo do card' },
};

export const WithTitle: Story = {
  args: {
    children: (
      <>
        <h3 style={{ margin: '0 0 8px 0' }}>Título</h3>
        <p style={{ margin: 0 }}>Descrição ou conteúdo do card.</p>
      </>
    ),
  },
};
