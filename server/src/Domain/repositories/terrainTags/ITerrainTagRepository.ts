import { TerrainTag } from "../../models/TerrainTag";

export interface ITerrainTagRepository {
    getAll() : Promise<TerrainTag[]>;
    getById(id : number) : Promise<TerrainTag>;
    create(tag: TerrainTag) : Promise<TerrainTag>; 
}