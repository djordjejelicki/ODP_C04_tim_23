import { IUserTrailRepository } from "../../../Domain/repositories/userTrails/IUserTrailRepository";
import { UserTrail } from "../../../Domain/models/UserTrail";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class UserTrailRepository implements IUserTrailRepository {
    async getByUser(user_id: number): Promise<UserTrail[]> {
        try{
            const query = `
                SELECT user_id, trail_id, status, added_at
                FROM user_trails
                WHERE user_id = ?
                ORDER BY added_at DESC  
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [user_id]);

            return rows.map(
                (row) => new UserTrail(row.user_id, row.trail_id, row.status, row.added_at)
            );
        } catch (error) {
            console.log("getByUser error: ", error);
            return [];
        }
    }

    async getOne(user_id: number, trail_id: number): Promise<UserTrail> {
        try{
            const query = `
                SELECT user_id, trail_id, status, added_at
                FROM user_trails
                WHERE user_id = ? AND trail_id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [user_id, trail_id]);

            if (rows.length > 0){
                const row = rows[0];
                return new UserTrail(row.user_id, row.trail_id, row.status, row.added_at);
            }

            return new UserTrail();
        } catch (error){
            console.log("getOne user_trails error: ", error);
            return new UserTrail();
        }
    }

    async add(userTrail: UserTrail): Promise<UserTrail> {
        try{
            const query = `
                INSERT INTO user_trails (user_id, trail_id, status)
                VALUES (?, ?, ?)
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                userTrail.user_id,
                userTrail.trail_id,
                userTrail.status
            ]);

            if (result.affectedRows > 0){
                return userTrail;
            }

            return new UserTrail();
        } catch(error) {
            console.log("add user_trails error: ", error);
            return new UserTrail();
        }
    }

    async updateStatus(user_id: number, trail_id: number, status: string): Promise<boolean> {
        try{
            const query = `
                UPDATE user_trails
                SET status = ?
                WHERE user_id = ? AND trail_id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                status,
                user_id,
                trail_id
            ]);

            return result.affectedRows > 0

        } catch(error) {
            console.log("updateStatus error: ", error);
            return false;
        }
    }

    async delete(user_id: number, trail_id: number): Promise<boolean> {
        try{
            const query = `
                DELETE FROM user_trails
                WHERE user_id = ? AND trail_id = ?
            `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                user_id,
                trail_id
            ]);

            return result.affectedRows > 0;
        } catch(error) {
            console.log("delete user_trails error: ", error);
            return false;
        }
    }
} 