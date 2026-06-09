
import type { AscentDetails } from "../../types/ascents/AscentDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IAscentAPIService {
    getAll(): Promise<AscentDetails[]>;
    create(
        trail_id: number,
        ascent_date: string,
        duration_min: number,
        note: string | null,
        rating: number
    ): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
    update(
        id: number,
        ascent_date: string,
        duration_min: number,
        note: string | null,
        rating: number,
        trail_id: number
    ): Promise<ApiResponse>;
}