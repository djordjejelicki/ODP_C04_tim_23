import { TrailDifficulty } from "../../Domain/enums/TrailDifficulty";
import { Trail } from "../../Domain/models/Trail";
import { ITrailRepository } from "../../Domain/repositories/trails/ITrailRepository";
import { ITrailService } from "../../Domain/services/trails/ITrailService";
import { ITrailTagRepository } from "../../Domain/repositories/trailTags/ITrailTagRepository";
import { TrailDetailsDto } from "../../Domain/DTOs/trails/TrailDetailsDto";


export class TrailService implements ITrailService {
    public constructor(
        private trailRepository: ITrailRepository,
        private trailTagRepository: ITrailTagRepository
    ) {}

    async getSveRute(): Promise<Trail[]> {
        return await this.trailRepository.getAll();
    }

    async getRutaById(id: number): Promise<TrailDetailsDto> {
        const trail =  await this.trailRepository.getById(id);

        if (trail.id === 0){
            return new TrailDetailsDto();
        }

        const terrainTags = await this.trailTagRepository.getTagsForTrail(id);

        return new TrailDetailsDto(
            trail.id,
            trail.mountain_id,
            trail.naziv,
            trail.opis,
            trail.duzina_km,
            trail.tezina,
            trail.trajanje_min,
            trail.visinski_uspon_m,
            trail.slika_url,
            trail.created_at,
            terrainTags
        );
    }

    async createRuta(mountain_id: number, naziv: string, opis: string | null, duzina_km: number, tezina: TrailDifficulty, trajanje_min: number, visinski_uspon_m: number, slika_url: string, terrain_tag_ids: number[]): Promise<Trail> {
        const novaRuta = new Trail(
            0, 
            mountain_id,
            naziv,
            opis,
            duzina_km,
            tezina,
            trajanje_min,
            visinski_uspon_m,
            slika_url,
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
}