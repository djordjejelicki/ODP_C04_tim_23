import { UserTrail } from "../../Domain/models/UserTrail";
import { IUserTrailRepository } from "../../Domain/repositories/userTrails/IUserTrailRepository";
import { IAscentRepository } from "../../Domain/repositories/ascents/IAscentRepository";
import { IUserTrailService } from "../../Domain/services/userTrails/IUserTrailService";
import { UserTrailStatus } from "../../Domain/enums/UserTrailStatus";
import { UserTrailDetailsDto } from "../../Domain/DTOs/my_trails/UserTrailDetailsDto";
import { IHikeRepository } from "../../Domain/repositories/hikes/IHikeRepository";
import { ITrailRepository } from "../../Domain/repositories/trails/ITrailRepository"; 
import { IHikeParticipantRepository } from "../../Domain/repositories/hikes/IHikeParticipantRepository";
import { IMountainRepository } from "../../Domain/repositories/mountains/IMountainRepository";

export class UserTrailService implements IUserTrailService {
    public constructor(
        private userTrailRepository: IUserTrailRepository,
        private ascentRepository: IAscentRepository,
        private hikeRepository: IHikeRepository,
        private trailRepository: ITrailRepository,
        private hikeParticipantRepository: IHikeParticipantRepository,
        private mountainRepository: IMountainRepository
    ) {}

    async getMojeRute(user_id: number): Promise<UserTrail[]> {
        return await this.userTrailRepository.getByUser(user_id);
    }

    async getDetaljiMojihRuta(user_id: number): Promise<UserTrailDetailsDto[]> {
        const userTrails = await this.userTrailRepository.getByUser(user_id);

        const details: UserTrailDetailsDto[] = [];

        for (const userTrail of userTrails){
            const trail = await this.trailRepository.getById(userTrail.trail_id);
            const mountain = await this.mountainRepository.getById(trail.mountain_id);

            details.push(
                new UserTrailDetailsDto(
                    userTrail.user_id,
                    userTrail.trail_id,
                    userTrail.status,
                    userTrail.added_at,
                    trail.name,
                    trail.length_km,
                    trail.elevation_m,
                    trail.difficulty,
                    trail.mountain_id,
                    mountain.name
                )
            );
        }

        return details;
    }

    async dodajRutu(user_id: number, trail_id: number, status: UserTrailStatus): Promise<UserTrail> {
        const postojecaRuta = await this.userTrailRepository.getOne(user_id, trail_id);
    
        if (postojecaRuta.user_id !== 0) {
            return new UserTrail();
        }
    
        const novaRuta = new UserTrail(
            user_id,
            trail_id,
            status,
            null
        );

        return await this.userTrailRepository.add(novaRuta);
    }

    async promeniStatus(user_id: number, trail_id: number, status: UserTrailStatus): Promise<boolean> {
        const postojecaRuta = await this.userTrailRepository.getOne(user_id, trail_id);

        if (postojecaRuta.user_id === 0){
            return false;
        }

        return await this.userTrailRepository.updateStatus(user_id, trail_id, status);
    }

    async ukloniRutu(user_id: number, trail_id: number): Promise<boolean> {
        const postojecaRuta = await this.userTrailRepository.getOne(user_id, trail_id);

        if (postojecaRuta.user_id === 0){
            return false;
        }

        const imaUspon = await this.ascentRepository.existsByUserAndTrail(user_id, trail_id);
        
        if(imaUspon){
            return false;
        }

        const organizovaniPohodi = await this.hikeRepository.getByUserId(user_id);

        const imaOrganizovanPohod = organizovaniPohodi.some(
            (hike) => hike.trail_id === trail_id
        );

        if (imaOrganizovanPohod) {
            return false;
        }

        const ucesca = await this.hikeParticipantRepository.getByUser(user_id);

        for(const ucesce of ucesca){
            const hike = await this.hikeRepository.getById(ucesce.hike_id);

            if(hike.id !== 0 && hike.trail_id === trail_id){
                return false;
            }
        }

        return await this.userTrailRepository.delete(user_id, trail_id);
    }
}