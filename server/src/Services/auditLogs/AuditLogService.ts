import { AuditLog } from "../../Domain/models/AuditLog";
import { AuditAction } from "../../Domain/enums/AuditAction";
import { IAuditLogRepository } from "../../Domain/repositories/auditLogs/IAuditLogRepository";
import { IAuditLogService } from "../../Domain/services/auditLogs/IAuditLogService";


export class AuditLogService implements IAuditLogService{
    public constructor(
        private auditLogRepository: IAuditLogRepository
    ) {}

    async getSviLogovi(): Promise<AuditLog[]> {
        return await this.auditLogRepository.getAll();
    }

    async createLog(user_id: number, action: AuditAction, entity: string, entity_id: number, details: string): Promise<AuditLog> {
        const log = new AuditLog(
            0,
            user_id,
            action,
            entity,
            entity_id,
            details,
        );

        return await this.auditLogRepository.create(log);
    }
}