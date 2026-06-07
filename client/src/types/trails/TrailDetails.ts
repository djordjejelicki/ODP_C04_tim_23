import type { Trail } from "./Trail";
import type { TerrainTag } from "../terrain_tags/TerrainTag";

export type TrailDetails = Trail & {
    terrain_tags: TerrainTag[];
    mountain_name: string;
};