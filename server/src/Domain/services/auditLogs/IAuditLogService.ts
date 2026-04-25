import { AuditLog } from "../../models/AuditLog";
import { AuditAction } from "../../enums/AuditAction";

export interface IAuditLogService {
    getSviLogovi(): Promise<AuditLog[]>;
    createLog(
        user_id: number,
        akcija: AuditAction,
        entitet: string,
        entitet_id: number,
        detalji: string | null
    ): Promise<AuditLog>;
}