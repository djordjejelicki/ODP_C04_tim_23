import type { AuditLog } from "../../types/audit_logs/AuditLog";

export interface IAuditLogAPIService {
    getAll(): Promise<AuditLog[]>;
}