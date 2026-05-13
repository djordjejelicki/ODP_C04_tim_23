import { IAscentRepository } from "../../../Domain/repositories/ascents/IAscentRepository";
import { Ascent } from "../../../Domain/models/Ascent";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { AsyncResource } from "node:async_hooks";
import { error } from "node:console";
import { AscentDetailsDto } from "../../../Domain/DTOs/ascents/AscentDetailsDto";

export class AscentRepository implements IAscentRepository {
    
    async getByUser(user_id: number): Promise<Ascent[]> {
        try{
            const query = `
                SELECT id, user_id, trail_id, ascent_date, duration_min, note, rating
                FROM ascents
                WHERE user_id = ?
                ORDER BY ascent_date DESC, id DESC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [user_id]);

            return rows.map(
                (row) => new Ascent(
                    row.id,
                    row.user_id,
                    row.trail_id,
                    row.ascent_date,
                    row.duration_min,
                    row.note,
                    row.rating
                )
            );
        } catch(error){
            console.log("getByUser ascents error: ", error);
            return [];
        }
    }

    async getById(id: number): Promise<Ascent> {
        try{
            const query = `
                SELECT id, user_id, trail_id, ascent_date, duration_min, note, rating
                FROM ascents
                WHERE id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0){
                const row = rows[0];
                return new Ascent(
                    row.id,
                    row.user_id,
                    row.trail_id,
                    row.ascent_date,
                    row.duration_min,
                    row.note,
                    row.rating
                );
            }

            return new Ascent();
        } catch(error){
            console.log("getById ascent error: ", error);
            return new Ascent();
        }
    }

    async add(ascent: Ascent): Promise<Ascent> {
        try{
            const query = `
                INSERT INTO ascents (user_id, trail_id, ascent_date, duration_min, note, rating)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                ascent.user_id,
                ascent.trail_id,
                ascent.ascent_date,
                ascent.duration_min,
                ascent.note,
                ascent.rating
            ]);

            if (result.insertId){
                return new Ascent(
                    result.insertId,
                    ascent.user_id,
                    ascent.trail_id,
                    ascent.ascent_date,
                    ascent.duration_min,
                    ascent.note,
                    ascent.rating
                );
            }

            return new Ascent();
        } catch(error){
            console.log("add ascent error: ", error);
            return new Ascent();
        }
    }

    async update(ascent: Ascent): Promise<boolean> {
        try{
            const query = `
                UPDATE ascents
                SET ascent_date = ?, duration_min = ?, note = ?, rating = ?
                WHERE id = ? 
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                ascent.ascent_date,
                ascent.duration_min,
                ascent.note,
                ascent.rating,
                ascent.id
            ]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("update ascent error: ", error);
            return false;
        }
    }

    async delete(id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM ascents
                WHERE id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("delete ascent error: ", error);
            return false;
        }
    }

    async existsByTrail(trail_id: number): Promise<boolean> {
        try{
            const query = `
                SELECT id FROM ascents
                WHERE trail_id = ?
                LIMIT 1
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [trail_id]);
            return rows.length > 0;
        } catch(error){
            console.log("existsByTrail error: ", error);
            return true;
        }
    }

    async existsByUserAndTrail(user_id: number, trail_id: number): Promise<boolean> {
        try{
            const query = `
                SELECT id
                FROM ascents
                WHERE user_id = ? AND trail_id = ?
                LIMIT 1
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [user_id, trail_id]);
            return rows.length > 0;
        } catch(error){
            console.log("existsByUserAndTrail error: ", error);
            return true;
        }   
    }

    async getDetailsByUser(user_id: number): Promise<AscentDetailsDto[]> {
        try{
            const query = `
                SELECT
                a.id,
                a.user_id,
                a.trail_id,
                t.name AS trail_name,
                a.ascent_date,
                a.duration_min,
                a.note,
                a.rating
                FROM ascents a
                INNER JOIN trails t ON t.id = a.trail_id
                WHERE a.user_id = ?
                ORDER BY a.ascent_date DESC, a.id DESC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [user_id]);

            return rows.map(
                (row) => new AscentDetailsDto(
                    row.id,
                    row.user_id,
                    row.trail_id,
                    row.trail_name,
                    row.ascent_date,
                    row.duration_min,
                    row.note,
                    row.rating    
                )
            );
        } catch(error){
            console.log("getDetailsByUser ascent error: ", error);
            return [];
        }
    }
}