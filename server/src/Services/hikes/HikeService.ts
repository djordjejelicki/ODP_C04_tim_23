import { Hike } from "../../Domain/models/Hike";
import { HikeParticipant } from "../../Domain/models/HikeParticipant";
import { HikeParticipantStatus } from "../../Domain/enums/HikeParticipantStatus";
import { IHikeRepository } from "../../Domain/repositories/hikes/IHikeRepository";
import { IHikeParticipantRepository } from "../../Domain/repositories/hikes/IHikeParticipantRepository";
import { IHikeService } from "../../Domain/services/hikes/IHikeService";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { HikeWithUserStatusDto } from "../../Domain/DTOs/hikes/HikeWithUserStatusDto";
import { IUserTrailRepository } from "../../Domain/repositories/userTrails/IUserTrailRepository";
import { UserTrail } from "../../Domain/models/UserTrail";
import { UserTrailStatus } from "../../Domain/enums/UserTrailStatus";
import { ITrailRepository } from "../../Domain/repositories/trails/ITrailRepository";

export class HikeService implements IHikeService{
    public constructor(
        private hikeRepository: IHikeRepository,
        private hikeParticipantRepository: IHikeParticipantRepository,
        private userRepository: IUserRepository,
        private userTrailRepository: IUserTrailRepository,
        private trailRepository: ITrailRepository
    ){}

    async getSviPohodi(): Promise<Hike[]> {
        return await this.hikeRepository.getAll();
    }

    async getPohodById(id: number): Promise<Hike> {
        return await this.hikeRepository.getById(id);
    }

    async korisnikImaPristupPohodu(hikeId: number, userId: number): Promise<boolean> {
        const hike = await this.hikeRepository.getById(hikeId);

        if (hike.id === 0){
            return false;
        }

        if (hike.organizer_id === userId){
            return true;
        }

        const participant = await this.hikeParticipantRepository.getOne(hikeId, userId);

        return participant.hike_id !== 0;

    }

    async kreirajPohod(organizer_id: number, trail_id: number, name: string, description: string | null, scheduled_at: Date, max_participants: number): Promise<Hike> {
        const noviPohod = new Hike(
            0,
            organizer_id,
            trail_id,
            name,
            description,
            scheduled_at,
            max_participants
        );

        return await this.hikeRepository.create(noviPohod);
    }

    async pozoviUcesnika(hike_id: number, organizer_id: number, username: string): Promise<boolean> {
        
        const hike = await this.hikeRepository.getById(hike_id);
        
        if (hike.id === 0){
            return false;
        }
        
        if (hike.organizer_id !== organizer_id){
            return false;
        }

        if (username.trim().length < 3){
            return false;
        }

        const user = await this.userRepository.getByUsername(username.trim());

        if (user.id === 0){
            return false;
        }

        if (organizer_id === user.id){
            return false;
        }
        
        const postojeci = await this.hikeParticipantRepository.getOne(hike_id, user.id);

        if (postojeci.hike_id !== 0){
            return false;
        }

        const participant = new HikeParticipant(
            hike_id,
            user.id,
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

        const uspesno = await this.hikeParticipantRepository.updateStatus(hike_id, user_id, status);

        if(!uspesno){
            return false;
        }

        if (status === HikeParticipantStatus.CONFIRMED){
            const hike = await this.hikeRepository.getById(hike_id);

            if (hike.id === 0){
                return false;
            }

            const postojecaRuta = await this.userTrailRepository.getOne(user_id, hike.trail_id);

            if (postojecaRuta.user_id === 0){
                const novaRuta = new UserTrail(
                    user_id,
                    hike.trail_id,
                    UserTrailStatus.WANT_TO_HIKE,
                    null
                );

                const dodataRuta = await this.userTrailRepository.add(novaRuta);
                return dodataRuta.user_id !== 0;
            }
        }

        return true;
    }

    async getUcesnici(hike_id: number): Promise<HikeParticipant[]> {
        return await this.hikeParticipantRepository.getByHike(hike_id);
    }

    async getPohodiZaKorisnika(userId: number): Promise<HikeWithUserStatusDto[]> {
        const orginizedHikes = await this.hikeRepository.getByUserId(userId);
        const participations = await this.hikeParticipantRepository.getByUser(userId);

        const invitedHikes: Hike[] = [];

        for (const participation of participations){
            const hike = await this.hikeRepository.getById(participation.hike_id);

            if (hike.id !== 0){
                invitedHikes.push(hike);
            }
        }

        const allHikes = [...orginizedHikes, ...invitedHikes];
        const details: HikeWithUserStatusDto[] = [];

        for (const hike of allHikes){
            const trail = await this.trailRepository.getById(hike.trail_id);
            const participation = participations.find(
                (item) => item.hike_id === hike.id
            );

            details.push(
                new HikeWithUserStatusDto(
                    hike.id,
                    hike.organizer_id,
                    hike.trail_id,
                    trail.name,
                    hike.name,
                    hike.description,
                    hike.scheduled_at,
                    hike.max_participants,
                    participation ? participation.status : null

                )
            );
        }

        return details;

    }
}