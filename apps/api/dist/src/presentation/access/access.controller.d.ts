import { AccessService } from '../../application/access/access.service';
export declare class AccessController {
    private readonly accessService;
    constructor(accessService: AccessService);
    check(clientId: string): Promise<{
        active: boolean;
        expiresAt: string | null;
        reason?: string;
    }>;
}
