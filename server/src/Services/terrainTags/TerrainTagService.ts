import { TerrainTag } from "../../Domain/models/TerrainTag";
import { ITerrainTagRepository } from "../../Domain/repositories/terrainTags/ITerrainTagRepository";
import { ITerrrainTagService } from "../../Domain/services/terrainTags/ITerrainTagService";
import { ITrailTagRepository } from "../../Domain/repositories/trailTags/ITrailTagRepository";

export class TerrainTagService implements ITerrrainTagService{
    public constructor(
        private terrainTagRepository : ITerrainTagRepository,
        private trailTagRepository: ITrailTagRepository
    ) {}

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

    async obrisiTipTerena(id: number): Promise<boolean> {
        const postojeciTag = await this.terrainTagRepository.getById(id);

        if (postojeciTag.id === 0){
            return false;
        }

        const koristiSe = await this.trailTagRepository.existsByTerrainTagId(id);

        if (koristiSe){
            return false;
        }

        return await this.terrainTagRepository.delete(id);
    }
}