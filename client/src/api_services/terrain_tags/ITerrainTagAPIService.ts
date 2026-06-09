import type { TerrainTag } from "../../types/terrain_tags/TerrainTag";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface ITerrainTagAPIService {
    getAll(): Promise<TerrainTag[]>;
    create(name: string, description: string): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
}