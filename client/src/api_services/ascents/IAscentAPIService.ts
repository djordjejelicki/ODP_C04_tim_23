import type { Ascent } from "../../types/ascents/Ascent";
import type { AscentDetails } from "../../types/ascents/AscentDetails";

export interface IAscentAPIService {
    getAll(): Promise<AscentDetails[]>;
    create(
        trail_id: number,
        ascent_date: string,
        duration_min: number,
        note: string | null,
        rating: number
    ): Promise<boolean>;
    remove(id: number): Promise<boolean>;
}