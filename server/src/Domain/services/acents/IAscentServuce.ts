import { Ascent } from "../../models/Ascent";

export interface IAscentService {
    getMojiUsponi(user_id: number): Promise<Ascent[]>;
    getUsponById(id: number): Promise<Ascent>;
    dodajUspon(
        user_id: number,
        trail_id: number,
        datum: Date,
        trajanje_min: number,
        napomena: string | null,
        ocena: number
    ): Promise<Ascent>;
    izmeniUspon(
        user_id: number,
        id: number,
        datum: Date,
        trajanje_min: number,
        napomena: string | null,
        ocena: number
    ): Promise<boolean>;
    obrisiUspon(user_id: number, id: number): Promise<boolean>;
}