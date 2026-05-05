import { ITrailRepository } from "../../../Domain/repositories/trails/ITrailRepository";
import { Trail } from "../../../Domain/models/Trail";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class TrailRepository implements ITrailRepository {
    async getAll(): Promise<Trail[]> {
        try{
            const query = `
                SELECT id, mountain_id, name, description, length_km, difficulty, est_duration_min, elevation_m, image_url, created_at
                FROM trails
                ORDER BY name ASC
            `;
    
            const [rows] = await db.execute<RowDataPacket[]>(query);
    
            return rows.map(row => new Trail(
                row.id,
                row.mountain_id,
                row.name, 
                row.description,
                row.length_km,
                row.difficulty,
                row.est_duration_min,
                row.elevation_m,
                row.image_url,
                row.created_at
            ));
        
        } catch (error) {
            console.log("getAll trails error: ", error);
            return [];
        }
    }

    async getById(id: number): Promise<Trail> {
        try{
            const query = `
                SELECT id, mountain_id, name, description, length_km, difficulty, est_duration_min, elevation_m, image_url, created_at
                FROM trails
                WHERE id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Trail(
                    row.id,
                    row.mountain_id,
                    row.name,
                    row.description,
                    row.length_km,
                    row.difficulty,
                    row.est_duration_min,
                    row.elevation_m,
                    row.image_url,
                    row.created_at
                );
            }

            return new Trail();
        } catch (error){
            console.log("getById trail error: ", error);
            return new Trail();
        }
    }

    async create(trail: Trail): Promise<Trail> {
        try{
            const query = `
                INSERT INTO trails (mountain_id, name, description, length_km, difficulty, est_duration_min, elevation_m, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                trail.mountain_id,
                trail.name,
                trail.description,
                trail.length_km,
                trail.difficulty,
                trail.est_duration_min,
                trail.elevation_m,
                trail.image_url
            ]);

            if (result.insertId) {
                return new Trail(
                    result.insertId,
                    trail.mountain_id,
                    trail.name,
                    trail.description,
                    trail.length_km,
                    trail.difficulty,
                    trail.est_duration_min,
                    trail.elevation_m,
                    trail.image_url
                );
            }

            return new Trail();
        } catch (error){
            console.log("create trail error: ", error);
            return new Trail();
        }
    }

    async update(trail: Trail): Promise<boolean> {
        try{
            const query = `
                UPDATE trails
                SET mountain_id = ?, name = ?, description = ?, length_km = ?, difficulty = ?, est_duration_min = ?, elevation_m = ?, image_url = ?
                WHERE id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                trail.mountain_id,
                trail.name,
                trail.description,
                trail.length_km,
                trail.difficulty,
                trail.est_duration_min,
                trail.elevation_m,
                trail.image_url,
                trail.id
            ]);

            return result.affectedRows > 0;
        } catch (error) {
            console.log("update trail error: ", error);
            return false;
        }
    }

    async delete(id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM trails
                WHERE id = ? 
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("delete trail error: ", error);
            return false;
        }
    }
}