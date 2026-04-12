import { IHikeRepository } from "../../../Domain/repositories/hikes/IHikeRepository";
import { Hike } from "../../../Domain/models/Hike";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class HikeRepository implements IHikeRepository {
    
}