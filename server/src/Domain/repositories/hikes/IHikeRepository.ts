import { HikeWithUserStatusDto } from "../../DTOs/hikes/HikeWithUserStatusDto";
import { Hike } from "../../models/Hike";


export interface IHikeRepository {
    getAll(): Promise<Hike[]>;
    getById(id: number): Promise<Hike>;
    getByUserId(userId: number): Promise<HikeWithUserStatusDto[]>;
    create(hike: Hike): Promise<Hike>;
    existsByUserAndTrail(user_id: number, trail_id: number): Promise<boolean>;
}