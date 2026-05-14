import type { TerrainTag } from "../../types/trails/TrailDetails";

export interface ITerrainTagAPIService {
    getAll(): Promise<TerrainTag[]>;
    create(name: string, description: string | null): Promise<boolean>;
    remove(id: number): Promise<boolean>;
}