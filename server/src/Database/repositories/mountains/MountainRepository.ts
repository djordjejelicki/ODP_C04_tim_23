import { IMountainRepository } from "../../../Domain/repositories/mountains/IMountainRepository";
import { Mountain } from "../../../Domain/models/Mountain";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class MountainRepository implements IMountainRepository {
    
    async getAll(): Promise<Mountain[]> {
        try{
            const query = `
                SELECT id, name, country, region, height, description, created_at
                FROM mountains
                ORDER BY name ASC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(row => new Mountain(
                row.id,
                row.name,
                row.country,
                row.region,
                row.height,
                row.description,
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
                SELECT id, name, country, region, height, description, created_at
                FROM mountains
                WHERE id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
            
            if (rows.length > 0){
                const row = rows[0];
                return new Mountain(
                    row.id,
                    row.name,
                    row.country,
                    row.region,
                    row.height,
                    row.description,
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
                INSERT INTO mountains (name, country, region, height, description)
                VALUES (?, ?, ?, ?, ?)
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                mountain.name,
                mountain.country,
                mountain.region,
                mountain.height,
                mountain.description
            ]);

            if (result.insertId) {
                return new Mountain(
                    result.insertId,
                    mountain.name,
                    mountain.country,
                    mountain.region,
                    mountain.height,
                    mountain.description
                );
            }

            return new Mountain();
        } catch(error){
            console.log("create mountain error:", error);
            return new Mountain();
        }
    }

    async getByNaziv(name: string): Promise<Mountain> {
        try {
            const query = `
                SELECT id, name, country, region, height, description, created_at
                FROM mountains
                WHERE name = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [name]);

            if (rows.length > 0){
                const row = rows[0];
                return new Mountain(
                    row.id,
                    row.name,
                    row.country,
                    row.region,
                    row.height,
                    row.description,
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
                SET name = ?, country = ?, region = ?, height = ?, description = ?
                WHERE id = ?  
            `;

            const [result] = await db.execute<ResultSetHeader>(query,[
                mountain.name,
                mountain.country,
                mountain.region,
                mountain.height,
                mountain.description,
                mountain.id
            ]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("update mountain error: ", error);
            return false;
        }
    }

    async delete(id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM mountains 
                WHERE id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("delete mountain error: ", error);
            return false;
        }
    }
}