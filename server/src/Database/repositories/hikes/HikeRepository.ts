import { IHikeRepository } from "../../../Domain/repositories/hikes/IHikeRepository";
import { HikeWithUserStatusDto } from "../../../Domain/DTOs/hikes/HikeWithUserStatusDto";
import { HikeParticipantStatus } from "../../../Domain/enums/HikeParticipantStatus";
import { Hike } from "../../../Domain/models/Hike";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class HikeRepository implements IHikeRepository {
    async getAll(): Promise<Hike[]> {
        try{
            const query = `
                SELECT id, organizer_id, trail_id, name, description, scheduled_at, max_participants
                FROM hikes
                ORDER BY scheduled_at ASC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new Hike(
                    row.id,
                    row.organizer_id,
                    row.trail_id,
                    row.name,
                    row.description,
                    row.scheduled_at,
                    row.max_participants
                )
            );

        } catch (error){
            console.log("getAll hikes error: ", error);
            return [];
        }
    }

    async getById(id: number): Promise<Hike> {
        try{
            const query = `
                SELECT id, organizer_id, trail_id, name, description, scheduled_at, max_participants
                FROM hikes
                WHERE id = ?  
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0){
                const row = rows[0];
                return new Hike(
                    row.id,
                    row.organizer_id,
                    row.trail_id,
                    row.name,
                    row.description,
                    row.scheduled_at,
                    row.max_participants
                );
            }

            return new Hike();
        } catch(error){
            console.log("getById hike error: ", error);
            return new Hike();
        }
    }

    async getByUserId(userId: number): Promise<HikeWithUserStatusDto[]> {
        try{
            const query = `
                    SELECT
                    h.id,
                    h.organizer_id,
                    h.trail_id,
                    t.name AS trail_name,
                    h.name,
                    h.description,
                    h.scheduled_at,
                    h.max_participants,
                    hp.status AS current_user_status
                    FROM hikes h
                    INNER JOIN trails t ON t.id = h.trail_id
                    LEFT JOIN hike_participants hp
                        ON hp.hike_id = h.id AND hp.user_id = ?
                    WHERE h.organizer_id = ? OR hp.user_id = ?
                    ORDER BY h.scheduled_at ASC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [userId, userId, userId]);

            return rows.map(
                (row) => new HikeWithUserStatusDto(
                    row.id,
                    row.organizer_id,
                    row.trail_id,
                    row.trail_name,
                    row.name,
                    row.description,
                    row.scheduled_at,
                    row.max_participants,
                    row.current_user_status as HikeParticipantStatus | null
                )
            );
        } catch(error){
            console.log("getByUserId hikes error: ", error);
            return [];
        }
    }

    async create(hike: Hike): Promise<Hike> {
        try{
            const query = `
                INSERT INTO hikes (organizer_id, trail_id, name, description, scheduled_at, max_participants)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                hike.organizer_id,
                hike.trail_id,
                hike.name,
                hike.description,
                hike.scheduled_at,
                hike.max_participants
            ]);

            if (result.insertId){
                return new Hike(
                    result.insertId,
                    hike.organizer_id,
                    hike.trail_id,
                    hike.name,
                    hike.description,
                    hike.scheduled_at,
                    hike.max_participants
                );
            }

            return new Hike();
        } catch (error){
            console.log("create hike error: ", error);
            return new Hike();
        }
    }

    async existsByUserAndTrail(user_id: number, trail_id: number): Promise<boolean> {
        try{
            const query = `
                SELECT h.id
                FROM hikes h
                LEFT JOIN hike_participants hp ON hp.hike_id = h.id
                WHERE h.trail_id = ?
                AND (h.organizer_id = ? OR hp.user_id = ?)
                LIMIT 1
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [trail_id, user_id, user_id]);
            return rows.length > 0;
        } catch(error){
            console.log("existsByUserAndTrail hike error: ", error);
            return false;
        }
    }
}