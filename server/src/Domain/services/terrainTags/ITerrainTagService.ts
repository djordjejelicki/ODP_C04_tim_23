import { TerrainTag } from "../../models/TerrainTag";
import { ServiceResult } from "../../common/ServiceResult";

export interface ITerrrainTagService {
    getSviTipoviTerena(): Promise<TerrainTag[]>;
    getTipTerenaById(id: number): Promise<TerrainTag>;
    createTipTerena(name: string, description: string | null): Promise<ServiceResult<TerrainTag>>;
    obrisiTipTerena(id: number): Promise<ServiceResult<null>>;
}