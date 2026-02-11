export declare class UpdateSubscriptionDto {
    price?: number;
    status?: 'active' | 'suspended' | 'cancelled';
    nextBillingDate?: Date;
}
