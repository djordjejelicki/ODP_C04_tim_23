import { UserTrail } from "../../models/UserTrail";
import { UserTrailStatus } from "../../enums/UserTrailStatus";
import { UserTrailDetailsDto } from "../../DTOs/my_trails/UserTrailDetailsDto";

export interface IUserTrailService {
    getMojeRute(user_id: number): Promise<UserTrail[]>;
    getDetaljiMojihRuta(user_id: number): Promise<UserTrailDetailsDto[]>;
    dodajRutu(user_id: number, trail_id: number, status: UserTrailStatus): Promise<UserTrail>;
    promeniStatus(user_id: number, trail_id: number, status: UserTrailStatus): Promise<boolean>;
    ukloniRutu(user_id: number, trail_id: number): Promise<boolean>;
}