import { ITrailRepository } from "../../../Domain/repositories/trails/ITrailRepository";
import { Trail } from "../../../Domain/models/Trail";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class TrailRepository implements ITrailRepository {
    async getAll(): Promise<Trail[]> {
        try{
            const query = `
                SELECT id, mountain_id, naziv, opis, duzina_km, tezina, trajanje_min, visinski_uspon_m, slika_url, created_at
                FROM trails
                ORDER BY naziv ASC
            `;
    
            const [rows] = await db.execute<RowDataPacket[]>(query);
    
            return rows.map(row => new Trail(
                row.id,
                row.mountain_id,
                row.naziv, 
                row.opis,
                row.duzina_km,
                row.tezina,
                row.trajanje_min,
                row.visinski_uspon_m,
                row.slika_url,
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
                SELECT id, mountain_id, naziv, opis, duzina_km, tezina, trajanje_min, visinski_uspon_m, slika_url, created_at
                FROM trails
                WHERE id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Trail(
                    row.id,
                    row.mountain_id,
                    row.naziv,
                    row.opis,
                    row.duzina_km,
                    row.tezina,
                    row.trajanje_min,
                    row.visinski_uspon_m,
                    row.slika_url,
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
                INSERT INTO trails (mountain_id, naziv, opis, duzina_km, tezina, trajanje_min, visinski_uspon_m, slika_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                trail.mountain_id,
                trail.naziv,
                trail.opis,
                trail.duzina_km,
                trail.tezina,
                trail.trajanje_min,
                trail.visinski_uspon_m,
                trail.slika_url
            ]);

            if (result.insertId) {
                return new Trail(
                    result.insertId,
                    trail.mountain_id,
                    trail.naziv,
                    trail.opis,
                    trail.duzina_km,
                    trail.tezina,
                    trail.trajanje_min,
                    trail.visinski_uspon_m,
                    trail.slika_url
                );
            }

            return new Trail();
        } catch (error){
            console.log("create trail error: ", error);
            return new Trail();
        }
    }
}