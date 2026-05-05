import { TerrainTag } from "../../models/TerrainTag";

export interface ITerrrainTagService {
    getSviTipoviTerena(): Promise<TerrainTag[]>;
    getTipTerenaById(id: number): Promise<TerrainTag>;
    createTipTerena(name: string, description: string | null): Promise<TerrainTag>;
    obrisiTipTerena(id: number): Promise<boolean>;
}