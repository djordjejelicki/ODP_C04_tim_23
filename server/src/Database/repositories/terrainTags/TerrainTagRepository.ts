import { ITerrainTagRepository } from "../../../Domain/repositories/terrainTags/ITerrainTagRepository";
import { TerrainTag } from "../../../Domain/models/TerrainTag";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class TerrainTagRepository implements ITerrainTagRepository {
    async getAll(): Promise<TerrainTag[]> {
        try{
            const query = `
                SELECT id, name, description
                FROM terrain_tags
                ORDER BY name ASC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new TerrainTag(row.id, row.name, row.description)
            );
        } catch(error) {
            console.log("getAll terrain tags error: ", error);
            return [];
        }
    }

    async getById(id: number): Promise<TerrainTag> {
        try{
            const query = `
                SELECT id, name, description
                FROM terrain_tags
                WHERE id = ? 
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0){
                const row = rows[0];
                return new TerrainTag(row.id, row.name, row.description);
            }

            return new TerrainTag();
        } catch(error){
            console.log("getById terrain tag error: ", error);
            return new TerrainTag();
        } 
    }

    async create(tag: TerrainTag): Promise<TerrainTag> {
        try{
            const query = `
                INSERT INTO terrain_tags (name, description)
                VALUES (?, ?)
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [tag.name, tag.description]);

            if(result.insertId){
                return new TerrainTag(result.insertId, tag.name, tag.description);
            }

            return new TerrainTag();
        } catch (error) {
            console.log("create terratin tag error: ", error);
            return new TerrainTag();
        }
    }

    async delete(id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM terrain_tags
                WHERE id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("delete terrain tag error: ", error);
            return false;
        }
    }
}