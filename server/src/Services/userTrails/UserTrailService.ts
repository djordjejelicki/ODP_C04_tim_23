import { UserTrail } from "../../Domain/models/UserTrail";
import { IUserTrailRepository } from "../../Domain/repositories/userTrails/IUserTrailRepository";
import { IAscentRepository } from "../../Domain/repositories/ascents/IAscentRepository";
import { IUserTrailService } from "../../Domain/services/userTrails/IUserTrailService";
import { UserTrailStatus } from "../../Domain/enums/UserTrailStatus";
import { UserTrailDetailsDto } from "../../Domain/DTOs/my_trails/UserTrailDetailsDto";
import { IHikeRepository } from "../../Domain/repositories/hikes/IHikeRepository";


export class UserTrailService implements IUserTrailService {
    public constructor(
        private userTrailRepository: IUserTrailRepository,
        private ascentRepository: IAscentRepository,
        private hikeRepostiroy: IHikeRepository
    ) {}

    async getMojeRute(user_id: number): Promise<UserTrail[]> {
        return await this.userTrailRepository.getByUser(user_id);
    }

    async getDetaljiMojihRuta(user_id: number): Promise<UserTrailDetailsDto[]> {
        return await this.userTrailRepository.getDetailsByUserId(user_id);
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

        const imaPohod = await this.hikeRepostiroy.existsByUserAndTrail(user_id, trail_id);

        if(imaPohod){
            return false;
        }

        return await this.userTrailRepository.delete(user_id, trail_id);
    }
}