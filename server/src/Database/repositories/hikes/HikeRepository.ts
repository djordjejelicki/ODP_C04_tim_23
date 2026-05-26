import { IHikeRepository } from "../../../Domain/repositories/hikes/IHikeRepository";
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

    async getByUserId(userId: number): Promise<Hike[]> {
        try{
            const query = `
                SELECT id, organizer_id, trail_id, name, description, scheduled_at, max_participants
                FROM hikes
                WHERE organizer_id = ?
                ORDER BY scheduled_at ASC    
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);

            return rows.map(
                (row) => new Hike(
                    row.id,
                    row.organizer_id,
                    row.trail_id,
                    row.name,
                    row.description,
                    row.scheduled_at,
                    row.max_participants,
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

    async update(hike: Hike): Promise<boolean> {
        try{
            const query = `
                UPDATE hikes
                SET trail_id = ?, name = ?, description = ?, scheduled_at = ?, max_participants = ?
                WHERE id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                hike.trail_id,
                hike.name,
                hike.description,
                hike.scheduled_at,
                hike.max_participants,
                hike.id
            ]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("update hike error: ", error);
            return false;
        }
    }

    async delete(id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM hikes
                WHERE id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("delete hike error: ", error);
            return false;
        }
    }

}