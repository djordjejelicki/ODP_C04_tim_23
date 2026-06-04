import { AscentDetailsDto } from "../../DTOs/ascents/AscentDetailsDto";
import { Ascent } from "../../models/Ascent";
import { ServiceResult } from "../../common/ServiceResult";

export interface IAscentService {
    getMojiUsponi(user_id: number): Promise<Ascent[]>;
    getDetaljiMojihUspona(user_id: number): Promise<AscentDetailsDto[]>;
    getUsponById(id: number): Promise<Ascent>;
    dodajUspon(
        user_id: number,
        trail_id: number,
        ascent_date: Date,
        duration_min: number,
        note: string | null,
        rating: number
    ): Promise<ServiceResult<Ascent>>;
    izmeniUspon(
        user_id: number,
        id: number,
        ascent_date: Date,
        duration_min: number,
        note: string | null,
        rating: number
    ): Promise<ServiceResult<null>>;
    obrisiUspon(user_id: number, id: number): Promise<ServiceResult<null>>;
}