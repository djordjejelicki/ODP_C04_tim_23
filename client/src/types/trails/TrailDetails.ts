import type { Trail } from "./Trail";

export type TerrainTag = {
    id: number;
    name: string;
    description: string | null;
};

export type TrailDetails = Trail & {
    terrain_tags: TerrainTag[];
};