import { AuditAction } from "../enums/AuditAction";

export class AuditLog {
    public constructor(
        public id: number = 0,
        public user_id: number = 0,
        public akcija: AuditAction = AuditAction.LOGOUT,
        public entitet: string = "",
        public entitet_id: number = 0,
        public detalji: string | null = null,
        public created_at: Date | null = null
    ) {}
}