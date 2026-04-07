import { UserTrail } from "../../models/UserTrail";
import { UserTrailStatus } from "../../enums/UserTrailStatus";
import { User } from "../../models/User";

export interface IUserTrailService {
    getMojeRute(user_id: number): Promise<UserTrail[]>;
    dodajRutu(user_id: number, trail_id: number, status: UserTrailStatus): Promise<UserTrail>;
    promeniStatus(user_id: number, trail_id: number, status: UserTrailStatus): Promise<boolean>;
    ukloniRutu(user_id: number, trail_id: number): Promise<boolean>;
}