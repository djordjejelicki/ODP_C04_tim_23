import type { Ascent } from "../../types/ascents/Ascent";

export interface IAscentAPIService {
    getAll(): Promise<Ascent[]>;
    create(
        trail_id: number,
        ascent_date: string,
        duration_min: number,
        note: string | null,
        rating: number
    ): Promise<boolean>;
    remove(id: number): Promise<boolean>;
}