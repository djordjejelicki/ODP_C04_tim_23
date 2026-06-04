import { UserTrail } from "../../models/UserTrail";
import { UserTrailStatus } from "../../enums/UserTrailStatus";
import { UserTrailDetailsDto } from "../../DTOs/my_trails/UserTrailDetailsDto";
import { ServiceResult } from "../../common/ServiceResult";

export interface IUserTrailService {
    getMojeRute(user_id: number): Promise<UserTrail[]>;
    getDetaljiMojihRuta(user_id: number): Promise<UserTrailDetailsDto[]>;
    dodajRutu(user_id: number, trail_id: number, status: UserTrailStatus): Promise<ServiceResult<UserTrail>>;
    promeniStatus(user_id: number, trail_id: number, status: UserTrailStatus): Promise<ServiceResult<null>>;
    ukloniRutu(user_id: number, trail_id: number): Promise<ServiceResult<null>>;
}