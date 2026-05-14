import { apiClient } from "../apiClient";
import type { AuditLog } from "../../types/audit_logs/AuditLog";
import type { IAuditLogAPIService } from "./IAuditLogAPIService";

export const auditLogApi: IAuditLogAPIService = {
    async getAll(): Promise<AuditLog[]>{
        try{
            const res = await apiClient.get<AuditLog[]>("audits/logs");
            return res.data;
        } catch (error){
            console.error("Error loading audit logs: ", error);
            return [];
        }
    },
};