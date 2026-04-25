import { AuditLog } from "../../models/AuditLog";

export interface IAuditLogRepository {
    getAll(): Promise<AuditLog[]>;
    create(log: AuditLog): Promise<AuditLog>;
}