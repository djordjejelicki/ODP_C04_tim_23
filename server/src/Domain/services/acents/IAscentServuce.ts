import { Ascent } from "../../models/Ascent";

export interface IAscentService {
    getMojiUsponi(user_id: number): Promise<Ascent[]>;
    getUsponById(id: number): Promise<Ascent>;
    dodajUspon(
        user_id: number,
        trail_id: number,
        ascent_date: Date,
        duration_min: number,
        note: string | null,
        rating: number
    ): Promise<Ascent>;
    izmeniUspon(
        user_id: number,
        id: number,
        ascent_date: Date,
        duration_min: number,
        note: string | null,
        rating: number
    ): Promise<boolean>;
    obrisiUspon(user_id: number, id: number): Promise<boolean>;
}