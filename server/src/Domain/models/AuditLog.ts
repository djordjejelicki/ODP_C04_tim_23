import { AuditAction } from "../enums/AuditAction";

export class AuditLog {
    public constructor(
        public id: number = 0,
        public user_id: number = 0,
        public action: AuditAction = AuditAction.LOGOUT,
        public entity: string = "",
        public entity_id: number = 0,
        public details: string = "",
        public created_at: Date = new Date()
    ) {}
}