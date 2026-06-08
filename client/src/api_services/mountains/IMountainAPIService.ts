import type { Mountain } from "../../types/mountains/Mountain";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IMountainAPIService {
    getAll(): Promise<Mountain[]>;
    create(
        name: string,
        country: string,
        region: string | null,
        height: number,
        description: string | null
    ): Promise<ApiResponse<Mountain>>;
    update(
        id: number,
        name: string,
        country: string,
        region: string | null,
        height: number,
        description: string | null
    ): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
};