export type InvoiceStatus = 'pending' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  clientId: string;
  subscriptionId: string;
  amount: number;
  dueDate: Date;
  status: InvoiceStatus;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceDto {
  clientId: string;
  subscriptionId: string;
  amount: number;
  dueDate: Date;
}

export interface PayInvoiceDto {
  paidAt?: Date;
}
