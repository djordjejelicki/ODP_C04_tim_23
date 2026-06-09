import type { Mountain } from "../../types/mountains/Mountain";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IMountainAPIService {
    getAll(): Promise<Mountain[]>;
    create(
        name: string,
        country: string,
        region: string,
        height: number,
        description: string
    ): Promise<ApiResponse>;
    update(
        id: number,
        name: string,
        country: string,
        region: string,
        height: number,
        description: string
    ): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
};