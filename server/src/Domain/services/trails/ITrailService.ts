import { Trail } from "../../models/Trail";

export interface ITrailService {
    getSveRute(): Promise<Trail[]>;
    getRutaById(id: number): Promise<Trail>;
    createRuta(
        mountain_id: number,
        naziv: string,
        opis: string | null,
        duzina_km: number,
        tezina: 'easy' | 'moderate' | 'hard' | 'expert',
        trajanje_min: number,
        visinski_uspon_m: number,
        slika_url: string
    ): Promise<Trail>;  
}