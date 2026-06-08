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
import { HikeDetailsDto } from "../../Domain/DTOs/hikes/HikeDetailsDto";
import { HikeParticipantDetailsDto } from "../../Domain/DTOs/hikes/HikeParticipantDetailsDto";
import { ServiceResult } from "../../Domain/common/ServiceResult";


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

    async kreirajPohod(
        organizer_id: number, 
        trail_id: number, 
        name: string, 
        description: string | null, 
        scheduled_at: Date, 
        max_participants: number
    ): Promise<ServiceResult> {

        const trail = await this.trailRepository.getById(trail_id);

        if (trail_id === 0){
            return ServiceResult.fail("Trail not found");
        }

        const noviPohod = new Hike(
            0,
            organizer_id,
            trail_id,
            name,
            description,
            scheduled_at,
            max_participants
        );

        const hike =  await this.hikeRepository.create(noviPohod);

        if (hike.id === 0){
            return ServiceResult.fail("Failed to create hike");
        }

        return ServiceResult.ok("Hike created successfully");
    }

    async pozoviUcesnika(hike_id: number, organizer_id: number, username: string): Promise<ServiceResult> {
        
        const hike = await this.hikeRepository.getById(hike_id);
        
        if (hike.id === 0){
            return ServiceResult.fail("Hike not found");
        }
        
        if (hike.organizer_id !== organizer_id){
            return ServiceResult.fail("Only the organizer can invite participants");
        }

        if (username.trim().length < 3){
            return ServiceResult.fail("Invalid username");
        }

        const user = await this.userRepository.getByUsername(username.trim());

        if (user.id === 0){
            return ServiceResult.fail("User not found");
        }

        if (organizer_id === user.id){
            return ServiceResult.fail("You cannot invite yourself");
        }
        
        const postojeci = await this.hikeParticipantRepository.getOne(hike_id, user.id);

        if (postojeci.hike_id !== 0){
            return ServiceResult.fail("User is already invited");
        }

        const participant = new HikeParticipant(
            hike_id,
            user.id,
            HikeParticipantStatus.INVITED,
            null
        );

        const uspesno =  await this.hikeParticipantRepository.add(participant);

        if (!uspesno){
            return ServiceResult.fail("Failed to send invitation");
        }

        return ServiceResult.ok("Participant invited successfully");
    }

    async odgovoriNaPoziv(hike_id: number, user_id: number, status: HikeParticipantStatus): Promise<ServiceResult> {
        const postojeci = await this.hikeParticipantRepository.getOne(hike_id, user_id);

        if (postojeci.hike_id === 0){
            return ServiceResult.fail("Invitation not found");
        }

        const uspesno = await this.hikeParticipantRepository.updateStatus(hike_id, user_id, status);

        if(!uspesno){
            return ServiceResult.fail("Failed to respond to invitation");
        }

        if (status === HikeParticipantStatus.CONFIRMED){
            const hike = await this.hikeRepository.getById(hike_id);

            if (hike.id === 0){
                return ServiceResult.fail("Hike not found");
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
                if(dodataRuta.user_id !== 0){
                    return ServiceResult.fail("Invitation accepted , but failed to add trail to your list");
                }

                return ServiceResult.ok("Invitation accepted successfully. Trail was added to your list")
            }

            return ServiceResult.ok("Invitation accepted successfully");
        }

        return ServiceResult.ok("Invitation declined successfully");
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

    async getDetaljiPohoda(hike_id: number): Promise<HikeDetailsDto> {
        const hike = await this.hikeRepository.getById(hike_id);

        if (hike.id === 0){
            return new HikeDetailsDto();
        }

        const organizer = await this.userRepository.getById(hike.organizer_id);
        const trail = await this.trailRepository.getById(hike.trail_id);
        const participants = await this.hikeParticipantRepository.getByHike(hike_id);

        const participantDetails: HikeParticipantDetailsDto[] = [];

        for (const participant of participants){
            const user = await this.userRepository.getById(participant.user_id);

            participantDetails.push(
                new HikeParticipantDetailsDto(
                    participant.user_id,
                    user.username,
                    participant.status,
                    participant.responded_at
                )
            );
        }

        return new HikeDetailsDto(
            hike.id,
            hike.organizer_id,
            organizer.username,
            hike.trail_id,
            trail.name,
            hike.name,
            hike.description,
            hike.scheduled_at,
            hike.max_participants,
            participantDetails
        );
    }

    async izmeniPohod(
        id: number, 
        organizer_id: number, 
        trail_id: number, 
        name: string, 
        description: string | null, 
        scheduled_at: Date, 
        max_participants: number
    ): Promise<ServiceResult> {
        const postojeciPohod = await this.hikeRepository.getById(id);
        
        if (postojeciPohod.id === 0){
            return ServiceResult.fail("Hike not found");
        }

        if (postojeciPohod.organizer_id !== organizer_id){
            return ServiceResult.fail("Only the organizer can update this hike");
        }

        const trail = await this.trailRepository.getById(trail_id);

        if (trail.id === 0){
            return ServiceResult.fail("Trail not found");
        }

        const izmenjeniPohod = new Hike(
            id,
            organizer_id,
            trail_id,
            name,
            description,
            scheduled_at,
            max_participants
        );


        const uspesno =  await this.hikeRepository.update(izmenjeniPohod);

        if (!uspesno){
            return ServiceResult.fail("Failed to update hike");
        }

        return ServiceResult.ok("Hike updated successfully");
    }

    async otkaziPohod(id: number, organizer_id: number): Promise<ServiceResult> {
        const postojeciPohod = await this.hikeRepository.getById(id);

        if (postojeciPohod.id === 0){
            return ServiceResult.fail("Hike not found");
        }

        if (postojeciPohod.organizer_id !== organizer_id){
            return ServiceResult.fail("Only the organizer can cancel this hike");
        }

        const obrisaniUcesnici = await this.hikeParticipantRepository.deleteByHike(id);

        if (!obrisaniUcesnici) {
            return ServiceResult.fail("Failed to remove hike participants");
        }

        const uspesno =  await this.hikeRepository.delete(id);

        if (!uspesno){
            return ServiceResult.fail("Failed to cancel hike");
        }

        return ServiceResult.ok("Hike canceled successfully");
    }

    async ukloniUcesnika(hike_id: number, organizer_id: number, user_id: number): Promise<ServiceResult> {
        const hike = await this.hikeRepository.getById(hike_id);

        if (hike.id === 0){
            return ServiceResult.fail("Hike not found");
        }

        if (hike.organizer_id !== organizer_id){
            return ServiceResult.fail("Only the organizer can remove participant");
        }

        if (organizer_id === user_id){
            return ServiceResult.fail("Organizer cannot be removed from the hike");
        }

        const participant = await this.hikeParticipantRepository.getOne(hike_id, user_id);

        if (participant.hike_id === 0){
            return ServiceResult.fail("Participant not found");
        }

        const uspesno =  await this.hikeParticipantRepository.deleteOne(hike_id, user_id);

        if (!uspesno){
            return ServiceResult.fail("Failed to remove participant");
        }

        return ServiceResult.ok("Participant removed successfully");
    }
}