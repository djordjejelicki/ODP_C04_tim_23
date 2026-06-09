export type AuditAction = "login" | "logout";

export type AuditLog = {
    id: number;
    user_id: number;
    action: AuditAction;
    entity: string;
    entity_id: number;
    details: string;
    created_at: string;
};