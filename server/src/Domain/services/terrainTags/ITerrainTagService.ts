import { TerrainTag } from "../../models/TerrainTag";

export interface ITerrrainTagService {
    getSviTipoviTerena() : Promise<TerrainTag[]>;
    getTipTerenaById(id: number) : Promise<TerrainTag>;
    createTipTerena(naziv: string, opis: string | null) : Promise<TerrainTag>;
}