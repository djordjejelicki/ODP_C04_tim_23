import { Hike } from "../../Domain/models/Hike";
import { HikeParticipant } from "../../Domain/models/HikeParticipant";
import { HikeParticipantStatus } from "../../Domain/enums/HikeParticipantStatus";
import { IHikeRepository } from "../../Domain/repositories/hikes/IHikeRepository";
import { IHikeParticipantRepository } from "../../Domain/repositories/hikes/IHikeParticipantRepository";
import { IHikeService } from "../../Domain/services/hikes/IHikeService";

export class HikeService implements IHikeService{
    public constructor(
        private hikeRepository: IHikeRepository,
        private hikeParticipantRepository: IHikeParticipantRepository
    ){}

    async getSviPohodi(): Promise<Hike[]> {
        return await this.hikeRepository.getAll();
    }

    async getPohodById(id: number): Promise<Hike> {
        return await this.hikeRepository.getById(id);
    }

    async kreirajPohod(organizator_id: number, trail_id: number, naziv: string, opis: string | null, datum_vreme: Date, maksimalan_broj_ucesnika: number): Promise<Hike> {
        const noviPohod = new Hike(
            0,
            organizator_id,
            trail_id,
            naziv,
            opis,
            datum_vreme,
            maksimalan_broj_ucesnika
        );

        return await this.hikeRepository.create(noviPohod);
    }

    async pozoviUcesnika(hike_id: number, user_id: number): Promise<boolean> {
        const postojeci = await this.hikeParticipantRepository.getOne(hike_id, user_id);

        if (postojeci.hike_id !== 0){
            return false;
        }

        const participant = new HikeParticipant(
            hike_id,
            user_id,
            HikeParticipantStatus.INVITED,
            null
        );

        return await this.hikeParticipantRepository.add(participant);
    }

    async odgovoriNaPoziv(hike_id: number, user_id: number, status: HikeParticipantStatus): Promise<boolean> {
        const postojeci = await this.hikeParticipantRepository.getOne(hike_id, user_id);

        if (postojeci.hike_id === 0){
            return false;
        }

        return await this.hikeParticipantRepository.updateStatus(hike_id, user_id, status);
    }

    async getUcesnici(hike_id: number): Promise<HikeParticipant[]> {
        return await this.hikeParticipantRepository.getByHike(hike_id);
    }
}