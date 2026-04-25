import { IAuditLogRepository } from "../../../Domain/repositories/auditLogs/IAuditLogRepository";
import { AuditLog } from "../../../Domain/models/AuditLog";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class AuditLogRepository implements IAuditLogRepository {
    async getAll(): Promise<AuditLog[]> {
        try{
            const query = `
                SELECT id, user_id, akcija, entitet, entitet_id, detalji, created_at
                FROM audit_logs
                ORDER BY created_at DESC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new AuditLog(
                    row.id,
                    row.user_id,
                    row.akcija,
                    row.entitet,
                    row.entitet_id,
                    row.detalji,
                    row.created_at
                )
            );
        } catch (error){
            console.log("getAll audit logs error: ", error);
            return [];
        }
    }

    async create(log: AuditLog): Promise<AuditLog> {
        try{
            const query = `
                INSERT INTO audit_logs (user_id, akcija, entitet, entitet_id, detalji)
                VALUES (?, ?, ?, ?, ?)
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                log.user_id,
                log.akcija,
                log.entitet,
                log.entitet_id,
                log.detalji
            ]);

            if (result.insertId) {
                return new AuditLog(
                    result.insertId,
                    log.user_id,
                    log.akcija,
                    log.entitet,
                    log.entitet_id,
                    log.detalji
                );
            }

            return new AuditLog();
        } catch (error){
            console.log("create audit logs error: ", error);
            return new AuditLog();
        }
    }
}