export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled';

export interface Subscription {
  id: string;
  clientId: string;
  productId: string;
  price: number;
  status: SubscriptionStatus;
  startDate: Date;
  nextBillingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionDto {
  clientId: string;
  productId: string;
  price: number;
  startDate?: Date;
}

export interface UpdateSubscriptionDto {
  price?: number;
  status?: SubscriptionStatus;
  nextBillingDate?: Date;
}
