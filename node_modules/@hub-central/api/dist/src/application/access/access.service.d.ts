import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class AccessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkAccess(clientId: string): Promise<{
        active: boolean;
        expiresAt: string | null;
        reason?: string;
    }>;
}
