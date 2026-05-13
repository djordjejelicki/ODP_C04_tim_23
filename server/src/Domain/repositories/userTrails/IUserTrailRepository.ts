import { UserTrailDetailsDto } from "../../DTOs/my_trails/UserTrailDetailsDto";
import { UserTrail } from "../../models/UserTrail";

export interface IUserTrailRepository {
    getByUser(user_id: number): Promise<UserTrail[]>;
    getDetailsByUserId(user_id: number): Promise<UserTrailDetailsDto[]>;
    getOne(user_id: number, trail_id: number): Promise<UserTrail>
    add(userTrail: UserTrail): Promise<UserTrail>;
    updateStatus(user_id: number, trail_id: number, status: string): Promise<boolean>;
    delete(user_id: number, trail_id: number): Promise<boolean>; 
}