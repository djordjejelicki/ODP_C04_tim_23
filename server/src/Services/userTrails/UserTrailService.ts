import { UserTrail } from "../../Domain/models/UserTrail";
import { IUserTrailRepository } from "../../Domain/repositories/userTrails/IUserTrailRepository";
import { IUserTrailService } from "../../Domain/services/userTrails/IUserTrailService";
import { UserTrailStatus } from "../../Domain/enums/UserTrailStatus";
import { stat } from "node:fs";

export class UserTrailService implements IUserTrailService {
    public constructor(private userTrailRepository: IUserTrailRepository) {}

    async getMojeRute(user_id: number): Promise<UserTrail[]> {
        return await this.userTrailRepository.getByUser(user_id);
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

        return await this.userTrailRepository.delete(user_id, trail_id);
    }
}