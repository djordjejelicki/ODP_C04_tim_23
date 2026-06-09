import { AuditLog } from "../../models/AuditLog";
import { AuditAction } from "../../enums/AuditAction";

export interface IAuditLogService {
    getSviLogovi(): Promise<AuditLog[]>;
    createLog(
        user_id: number,
        action: AuditAction,
        entity: string,
        entity_id: number,
        details: string
    ): Promise<AuditLog>;
}