import { IMountainRepository } from "../../../Domain/repositories/mountains/IMountainRepository";
import { Mountain } from "../../../Domain/models/Mountain";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class MountainRepository implements IMountainRepository {
    
    async getAll(): Promise<Mountain[]> {
        try{
            const query = `
                SELECT id, naziv, drzava, region, visina, opis, created_at
                FROM mountains
                ORDER BY naziv ASC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(row => new Mountain(
                row.id,
                row.naziv,
                row.drzava,
                row.region,
                row.visina,
                row.opis,
                row.created_at
            ));
        } catch (error){
            console.log("getAll mountains error: ", error);
            return [];
        }
    }

    async getById(id: number): Promise<Mountain> {
        try{
            const query = `
                SELECT id, naziv, drzava, region, visina, opis, created_at
                FROM mountains
                WHERE id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
            
            if (rows.length > 0){
                const row = rows[0];
                return new Mountain(
                    row.id,
                    row.naziv,
                    row.drzava,
                    row.region,
                    row.visina,
                    row.opis,
                    row.created_at
                );
            }

            return new Mountain();
        
        } catch (error){
            console.log("getById mountain error: ", error);
            return new Mountain();
        }
    }

    async create(mountain: Mountain): Promise<Mountain> {
        try{
            const query = `
                INSERT INTO mountains (naziv, drzava, region, visina, opis)
                VALUES (?, ?, ?, ?, ?)
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                mountain.naziv,
                mountain.drzava,
                mountain.region,
                mountain.visina,
                mountain.opis
            ]);

            if (result.insertId) {
                return new Mountain(
                    result.insertId,
                    mountain.naziv,
                    mountain.drzava,
                    mountain.region,
                    mountain.visina,
                    mountain.opis
                );
            }

            return new Mountain();
        } catch(error){
            console.log("create mountain error:", error);
            return new Mountain();
        }
    }

    async getByNaziv(naziv: string): Promise<Mountain> {
        try {
            const query = `
                SELECT id, naziv, drzava, region, visina, opis, created_at
                FROM mountains
                WHERE naziv = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [naziv]);

            if (rows.length > 0){
                const row = rows[0];
                return new Mountain(
                    row.id,
                    row.naziv,
                    row.drzava,
                    row.region,
                    row.visina,
                    row.opis,
                    row.created_at
                );
            }

            return new Mountain();
        } catch(error) {
            console.log("getByNaziv mountain error: ", error);
            return new Mountain();
        }
    }

    async update(mountain: Mountain): Promise<boolean> {
        try{
            const query = `
                UPDATE mountains
                SET naziv = ?, drzava = ?, region = ?, visina = ?, opis = ?
                WHERE id = ?  
            `;

            const [result] = await db.execute<ResultSetHeader>(query,[
                mountain.naziv,
                mountain.drzava,
                mountain.region,
                mountain.visina,
                mountain.opis,
                mountain.id
            ]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("update mountain error: ", error);
            return false;
        }
    }
}