export interface AccessCheckResponse {
  active: boolean;
  expiresAt: string | null;
  reason?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  suspendedClients: number;
  monthlyRevenue: number;
  mrr: number;
  pendingInvoices: number;
  overdueInvoices: number;
}
