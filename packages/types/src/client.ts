export type ClientStatus = 'active' | 'suspended';

export interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string | null;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDto {
  name: string;
  document: string;
  email: string;
  phone?: string;
}

export interface UpdateClientDto {
  name?: string;
  document?: string;
  email?: string;
  phone?: string;
  status?: ClientStatus;
}
