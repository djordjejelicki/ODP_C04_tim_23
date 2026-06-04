import { TerrainTag } from "../../Domain/models/TerrainTag";
import { ITerrainTagRepository } from "../../Domain/repositories/terrainTags/ITerrainTagRepository";
import { ITerrrainTagService } from "../../Domain/services/terrainTags/ITerrainTagService";
import { ITrailTagRepository } from "../../Domain/repositories/trailTags/ITrailTagRepository";
import { ServiceResult } from "../../Domain/common/ServiceResult";


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

    async createTipTerena(name: string, description: string | null): Promise<ServiceResult<TerrainTag>> {

        if (!name || name.trim().length < 2){
            return ServiceResult.fail<TerrainTag>("Terrain tag must be at least 2 characters long");
        }

        const noviTag = new TerrainTag(0, name, description);
        
        const createdTag =  await this.terrainTagRepository.create(noviTag);

        if (createdTag.id === 0){
            return ServiceResult.fail<TerrainTag>("Failed to create terrain tag");
        }

        return ServiceResult.ok<TerrainTag>("Terrain tag created successfully", createdTag);
    }

    async obrisiTipTerena(id: number): Promise<ServiceResult<null>> {
        const postojeciTag = await this.terrainTagRepository.getById(id);

        if (postojeciTag.id === 0){
            return ServiceResult.fail<null>("Terrain tag not found");
        }

        const koristiSe = await this.trailTagRepository.existsByTerrainTagId(id);

        if (koristiSe){
            return ServiceResult.fail<null>("Terrain tag cannot be deleted because it is used by one or more trails");
        }

        const deleted =  await this.terrainTagRepository.delete(id);

        if (!deleted){
            return ServiceResult.fail<null>("Failed to delete terrain tag");
        }

        return ServiceResult.ok<null>("Terrain tag deleted successfully");
    }
}