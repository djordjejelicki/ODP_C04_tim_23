import { IHikeParticipantRepository } from "../../../Domain/repositories/hikes/IHikeParticipantRepository";
import { HikeParticipant } from "../../../Domain/models/HikeParticipant";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class HikeParticipantRepository implements IHikeParticipantRepository{
    async add(participant: HikeParticipant): Promise<boolean> {
        try{
            const query = `
                INSERT INTO hike_participants (hike_id, user_id, status)
                VALUES (?, ?, ?) 
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                participant.hike_id,
                participant.user_id,
                participant.status
            ]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("add hikeParticipant error: ", error);
            return false;
        }
    }

    async getByHike(hike_id: number): Promise<HikeParticipant[]> {
        try{
            const query = `
                SELECT hike_id, user_id, status, responded_at
                FROM hike_participants
                WHERE hike_id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [hike_id]);

            return rows.map(
                (row) => new HikeParticipant(
                    row.hike_id,
                    row.user_id,
                    row.status,
                    row.responded_at
                )
            );
        } catch (error){
            console.log("getByHike hikeParticipant error: ", error);
            return [];
        }
    }

    async getByUser(user_id: number): Promise<HikeParticipant[]> {
        try{
            const query = `
                SELECT hike_id, user_id, status, responded_at
                FROM hike_participants
                WHERE user_id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [user_id]);

            return rows.map(
                (row) => new HikeParticipant(
                    row.hike_id,
                    row.user_id,
                    row.status,
                    row.responded_at
                )
            );

        } catch(error){
            console.log("getByUser hike participants error: ",error);
            return [];
        }
    }

    async getOne(hike_id: number, user_id: number): Promise<HikeParticipant> {
        try{
            const query = `
                SELECT hike_id, user_id, status, responded_at
                FROM hike_participants
                WHERE hike_id = ? AND user_id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [hike_id, user_id]);

            if (rows.length > 0){
                const row = rows[0];
                return new HikeParticipant(
                    row.hike_id,
                    row.user_id,
                    row.status,
                    row.responded_at
                );
            }

            return new HikeParticipant();
        } catch (error){
            console.log("getOne hikeParticipant error: ", error);
            return new HikeParticipant();
        }
    }

    async updateStatus(hike_id: number, user_id: number, status: string): Promise<boolean> {
        try{
            const query = `
                UPDATE hike_participants
                SET status = ?, responded_at = NOW()
                WHERE hike_id = ? AND user_id = ? 
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [status, hike_id, user_id]);

            return result.affectedRows > 0;
        } catch(error) {
            console.log("updateStatus hikeParticipant error: ", error);
            return false;
        }
    }

    async deleteByHike(hike_id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM hike_participants
                WHERE hike_id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [hike_id]);
            return result.affectedRows >= 0;
        } catch(error){
            console.log("deleteByHike hikeParticipant error: ", error);
            return false;
        }
    }

    async deleteOne(hike_id: number, user_id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM hike_participants
                WHERE hike_id = ? AND user_id = ? 
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                hike_id,
                user_id
            ]);

            return result.affectedRows > 0;
        } catch(error){
            console.log("deleteOne hikeParticipant error: ", error);
            return false;
        }
    }
}