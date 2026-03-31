import { TerrainTag } from "../../Domain/models/TerrainTag";
import { ITerrainTagRepository } from "../../Domain/repositories/terrainTags/ITerrainTagRepository";
import { ITerrrainTagService } from "../../Domain/services/terrainTags/ITerrainTagService";

export class TerrainTagService implements ITerrrainTagService{
    public constructor(private terrainTagRepository : ITerrainTagRepository) {}

    async getSviTipoviTerena(): Promise<TerrainTag[]> {
        return await this.terrainTagRepository.getAll();
    }

    async getTipTerenaById(id: number): Promise<TerrainTag> {
        return await this.terrainTagRepository.getById(id);
    }

    async createTipTerena(naziv: string, opis: string | null): Promise<TerrainTag> {
        const noviTag = new TerrainTag(0, naziv, opis);
        return await this.terrainTagRepository.create(noviTag);
    }
}