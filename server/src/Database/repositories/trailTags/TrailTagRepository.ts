import { ITrailTagRepository } from "../../../Domain/repositories/trailTags/ITrailTagRepository";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { TerrainTag } from "../../../Domain/models/TerrainTag";

export class TrailTagRepository implements ITrailTagRepository {
    async addTagsToTrail(traild_id: number, terrain_tag_id: number[]): Promise<void> {
        try{
            const query = `
                INSERT INTO trail_tags (trail_id, terrain_tag_id)
                VALUES (?, ?)
            `;

            for (const tagId of terrain_tag_id){
                await db.execute(query, [traild_id, tagId]);
            }
        } catch (error) {
            console.log("addTagsToTrail error: ", error);
        }
    }

    async getTagsForTrail(traild_id: number): Promise<TerrainTag[]> {
        try {
            const query = `
                SELECT tt.id, tt.name, tt.description
                FROM terrain_tags tt
                INNER JOIN trail_tags trt ON tt.id = trt.terrain_tag_id
                WHERE trt.trail_id = ?
                ORDER BY tt.name ASC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [traild_id]);

            return rows.map(
                (row) => new TerrainTag(row.id, row.naziv, row.opis)
            );
            
        } catch (error) {
            console.log("getTagsForTrail error: ", error);
            return [];
        }
    }

    async deleteTagsForTrail(trail_id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM trail_tags
                WHERE trail_id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [trail_id]);

            return result.affectedRows >= 0;
        } catch (error){
            console.log("deleteTagsForTrail error: ", error);
            return false;
        }
    }

    async existsByTerrainTagId(terrain_tag_id: number): Promise<boolean> {
        try{
            const query = `
                SELECT trail_id
                FROM trail_tags
                WHERE terrain_tag_id = ?
                LIMIT 1
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [terrain_tag_id]);
            return rows.length > 0;
        } catch(error) {
            console.log("existsByTerrainTagId error: ", error);
            return true;
        }
    }
}