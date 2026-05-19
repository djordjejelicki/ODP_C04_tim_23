import { Hike } from "../../models/Hike";


export interface IHikeRepository {
    getAll(): Promise<Hike[]>;
    getById(id: number): Promise<Hike>;
    getByUserId(userId: number): Promise<Hike[]>;
    create(hike: Hike): Promise<Hike>;
}