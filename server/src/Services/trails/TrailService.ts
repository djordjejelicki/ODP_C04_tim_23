import { TrailDifficulty } from "../../Domain/enums/TrailDifficulty";
import { Trail } from "../../Domain/models/Trail";
import { ITrailRepository } from "../../Domain/repositories/trails/ITrailRepository";
import { ITrailService } from "../../Domain/services/trails/ITrailService";
import { ITrailTagRepository } from "../../Domain/repositories/trailTags/ITrailTagRepository";
import { TrailDetailsDto } from "../../Domain/DTOs/trails/TrailDetailsDto";
import { IAscentRepository } from "../../Domain/repositories/ascents/IAscentRepository";
import { ITerrainTagRepository } from "../../Domain/repositories/terrainTags/ITerrainTagRepository";
import { TerrainTag } from "../../Domain/models/TerrainTag";
import { TrailCatalogDto } from "../../Domain/DTOs/trails/TrailCatalogDto";
import { IMountainRepository } from "../../Domain/repositories/mountains/IMountainRepository";


export class TrailService implements ITrailService {
    public constructor(
        private trailRepository: ITrailRepository,
        private trailTagRepository: ITrailTagRepository,
        private ascentRepository: IAscentRepository,
        private terrainTagRepository: ITerrainTagRepository,
        private mountainRepository: IMountainRepository
    ) {}

    async getSveRute(): Promise<TrailCatalogDto[]> {
        const trails =  await this.trailRepository.getAll();
        const result: TrailCatalogDto[] = [];

        for (const trail of trails){
            const averageRating = await this.ascentRepository.getAverageRatingByTrail(trail.id);

            result.push(new TrailCatalogDto(
                trail.id,
                trail.mountain_id,
                trail.name,
                trail.description,
                trail.length_km,
                trail.difficulty,
                trail.est_duration_min,
                trail.elevation_m,
                trail.image_url,
                trail.created_at,
                averageRating
            ));
        }

        return result;
    }

    async getRutaById(id: number): Promise<TrailDetailsDto> {
        const trail =  await this.trailRepository.getById(id);

        if (trail.id === 0){
            return new TrailDetailsDto();
        }

        
        const trailTags = await this.trailTagRepository.getTagsForTrail(id);
        const mountain = await this.mountainRepository.getById(trail.mountain_id);
        const terrainTags: TerrainTag[] = [];

        for (const trailTag of trailTags) {
            const tag = await this.terrainTagRepository.getById(trailTag.terrain_tag_id);
            if (tag.id !== 0){
                terrainTags.push(tag);
            }
        }

        const averageRating = await this.ascentRepository.getAverageRatingByTrail(id);

        return new TrailDetailsDto(
            trail.id,
            trail.mountain_id,
            trail.name,
            trail.description,
            trail.length_km,
            trail.difficulty,
            trail.est_duration_min,
            trail.elevation_m,
            trail.image_url,
            trail.created_at,
            terrainTags,
            averageRating,
            mountain.name
        );
    }

    async createRuta(mountain_id: number, name: string, description: string | null, length_km: number, difficulty: TrailDifficulty, est_duration_min: number, elevation_m: number, image_url: string, terrain_tag_ids: number[]): Promise<Trail> {
        const novaRuta = new Trail(
            0, 
            mountain_id,
            name,
            description,
            length_km,
            difficulty,
            est_duration_min,
            elevation_m,
            image_url,
            null
        );

        const kreiranaRuta =  await this.trailRepository.create(novaRuta);

        if (kreiranaRuta.id === 0){
            return new Trail();
        }

        if (terrain_tag_ids.length > 0){
            await this.trailTagRepository.addTagsToTrail(kreiranaRuta.id, terrain_tag_ids);
        }

        return kreiranaRuta;
    }

    async updateRuta(id: number, mountain_id: number, name: string, description: string | null, length_km: number, difficulty: TrailDifficulty, est_duration_min: number, elevation_m: number, image_url: string, terrain_tag_ids: number[]): Promise<boolean> {
        const postojecaRuta = await this.trailRepository.getById(id);

        if (postojecaRuta.id === 0) {
            return false;
        }

        const izmenjenaRuta = new Trail(
            id,
            mountain_id,
            name,
            description,
            length_km,
            difficulty,
            est_duration_min,
            elevation_m,
            image_url,
            postojecaRuta.created_at
        );

        const uspesno = await this.trailRepository.update(izmenjenaRuta);

        if (!uspesno){
            return false;
        }

        const obrisaniTagovi = await this.trailTagRepository.deleteTagsForTrail(id);

        if (!obrisaniTagovi) {
            return false;
        }

        if (terrain_tag_ids.length > 0){
            await this.trailTagRepository.addTagsToTrail(id, terrain_tag_ids);
        }

        return true;
    }

    async deleteRuta(id: number): Promise<boolean> {
        const postojecaRuta = await this.trailRepository.getById(id);

        if (postojecaRuta.id === 0){
            return false;
        }

        const postojeUsponi = await this.ascentRepository.existsByTrail(id);
        if(postojeUsponi){
            return false;
        }

        await this.trailTagRepository.deleteTagsForTrail(id);

        return await this.trailRepository.delete(id);
    }
}