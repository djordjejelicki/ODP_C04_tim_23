import type { TerrainTag } from "../../types/trails/TrailDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface ITerrainTagAPIService {
    getAll(): Promise<TerrainTag[]>;
    create(name: string, description: string | null): Promise<ApiResponse<TerrainTag>>;
    remove(id: number): Promise<ApiResponse>;
}