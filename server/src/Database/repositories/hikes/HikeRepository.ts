import { IHikeRepository } from "../../../Domain/repositories/hikes/IHikeRepository";
import { Hike } from "../../../Domain/models/Hike";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class HikeRepository implements IHikeRepository {
    async getAll(): Promise<Hike[]> {
        try{
            const query = `
                SELECT id, organizator_id, trail_id, naziv, opis, datum_vreme, maksimalan_broj_ucesnika
                FROM hikes
                ORDER BY datum_vreme ASC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new Hike(
                    row.id,
                    row.organizator_id,
                    row.trail_id,
                    row.naziv,
                    row.opis,
                    row.datum_vreme,
                    row.maksimalan_broj_ucesnika
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
                SELECT id, organizator_id, trail_id, naziv, opis, datum_vreme, maksimalan_broj_ucesnika
                FROM hikes
                WHERE id = ?  
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0){
                const row = rows[0];
                return new Hike(
                    row.id,
                    row.organizator_id,
                    row.trail_id,
                    row.naziv,
                    row.opis,
                    row.datum_vreme,
                    row.maksimalan_broj_ucesnika
                );
            }

            return new Hike();
        } catch(error){
            console.log("getById hike error: ", error);
            return new Hike();
        }
    }

    async create(hike: Hike): Promise<Hike> {
        try{
            const query = `
                INSERT INTO hikes (organizator_id, trail_id, naziv, opis, datum_vreme, maksimalan_broj_ucesnika)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                hike.organizator_id,
                hike.trail_id,
                hike.naziv,
                hike.opis,
                hike.datum_vreme,
                hike.maksimalan_broj_ucesnika
            ]);

            if (result.insertId){
                return new Hike(
                    result.insertId,
                    hike.organizator_id,
                    hike.trail_id,
                    hike.naziv,
                    hike.opis,
                    hike.datum_vreme,
                    hike.maksimalan_broj_ucesnika
                );
            }

            return new Hike();
        } catch (error){
            console.log("create hike error: ", error);
            return new Hike();
        }
    }
}