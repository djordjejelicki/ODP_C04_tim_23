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
import fs from "fs";
import path from "path";
import { ServiceResult } from "../../Domain/common/ServiceResult";


export class TrailService implements ITrailService {
    public constructor(
        private trailRepository: ITrailRepository,
        private trailTagRepository: ITrailTagRepository,
        private ascentRepository: IAscentRepository,
        private terrainTagRepository: ITerrainTagRepository,
        private mountainRepository: IMountainRepository
    ) {}

    private deleteTrailImage(imageUrl: string): void {
        if (!imageUrl.startsWith("/uploads/trails/")){
            return;
        }

        const relativePath = imageUrl.replace("/uploads/", "");
        const filePath = path.join(__dirname, "../../../uploads", relativePath);
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
    }

    async getSveRute(): Promise<TrailCatalogDto[]> {
        const trails =  await this.trailRepository.getAll();
        const result: TrailCatalogDto[] = [];

        for (const trail of trails){
            const trailTags = await this.trailTagRepository.getTagsForTrail(trail.id);
            const terrainTags: TerrainTag[] = [];

            for (const trailTag of trailTags){
                const tag = await this.terrainTagRepository.getById(
                    trailTag.terrain_tag_id
                );

                if (tag.id !== 0){
                    terrainTags.push(tag);
                }
            }

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
                averageRating,
                terrainTags
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

    async createRuta(
        mountain_id: number, 
        name: string, 
        description: string, 
        length_km: number, 
        difficulty: TrailDifficulty, 
        est_duration_min: number, 
        elevation_m: number, 
        image_url: string, 
        terrain_tag_ids: number[]
    ): Promise<ServiceResult> {
        
        const mountain = await this.mountainRepository.getById(mountain_id);

        if (mountain.id === 0){
            return ServiceResult.fail("Mountain not found");
        }
        
        
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
        );

        const kreiranaRuta =  await this.trailRepository.create(novaRuta);

        if (kreiranaRuta.id === 0){
            return ServiceResult.fail("Failed to create trail");
        }

        if (terrain_tag_ids.length > 0){
            await this.trailTagRepository.addTagsToTrail(kreiranaRuta.id, terrain_tag_ids);
        }

        return ServiceResult.ok("Trail created successfully");
    }

    async updateRuta(
        id: number, 
        mountain_id: number, 
        name: string, 
        description: string, 
        length_km: number, 
        difficulty: TrailDifficulty, 
        est_duration_min: number, 
        elevation_m: number, 
        image_url: string, 
        terrain_tag_ids: number[]
    ): Promise<ServiceResult> {
        const postojecaRuta = await this.trailRepository.getById(id);

        if (postojecaRuta.id === 0) {
            return ServiceResult.fail("Trail not found");
        }

        const mountain  = await this.mountainRepository.getById(mountain_id);

        if (mountain.id === 0){
            return ServiceResult.fail("Mountain not found");
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
            return ServiceResult.fail("Failed to update trail");
        }
        
        if (postojecaRuta.image_url !== image_url && postojecaRuta.image_url){
            this.deleteTrailImage(postojecaRuta.image_url);
        }

        const obrisaniTagovi = await this.trailTagRepository.deleteTagsForTrail(id);

        if (!obrisaniTagovi) {
            return ServiceResult.fail("Failed to update trail tags");
        }

        if (terrain_tag_ids.length > 0){
            await this.trailTagRepository.addTagsToTrail(id, terrain_tag_ids);
        }

        return ServiceResult.ok("Trail updated successfully");
    }

    async deleteRuta(id: number): Promise<ServiceResult> {
        const postojecaRuta = await this.trailRepository.getById(id);

        if (postojecaRuta.id === 0){
            return ServiceResult.fail("Trail not found");
        }

        const postojeUsponi = await this.ascentRepository.existsByTrail(id);
        if(postojeUsponi){
            return ServiceResult.fail("Trail cannot be deleted because it has recorded ascents");
        }

        const obrisaniTagovi = await this.trailTagRepository.deleteTagsForTrail(id);

        if (!obrisaniTagovi){
            return ServiceResult.fail("Failed to delete trail tags");
        }

        const uspesno =  await this.trailRepository.delete(id);

        if(!uspesno){
            return ServiceResult.fail("Failed to delte trail");
        }
        
        this.deleteTrailImage(postojecaRuta.image_url);
        return ServiceResult.ok("Trail deleted successfully");
    }
}