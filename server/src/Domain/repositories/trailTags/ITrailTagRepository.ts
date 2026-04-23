import { TrailTag } from "../../models/TrailTag";
import { TerrainTag } from "../../models/TerrainTag";

export interface ITrailTagRepository {
    addTagsToTrail(traild_id: number, terrain_tag_id: number[]): Promise<void>;
    getTagsForTrail(traild_id: number): Promise<TerrainTag[]>;
    deleteTagsForTrail(trail_id: number): Promise<boolean>;
    existsByTerrainTagId(terrain_tag_id: number): Promise<boolean>;
}