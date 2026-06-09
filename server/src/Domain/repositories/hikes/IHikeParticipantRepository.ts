import { HikeParticipant } from "../../models/HikeParticipant";

export interface IHikeParticipantRepository {
    add(participant: HikeParticipant): Promise<boolean>;
    getByHike(hike_id: number): Promise<HikeParticipant[]>;
    getByUser(user_id: number): Promise<HikeParticipant[]>;
    getOne(hike_id: number, user_id: number): Promise<HikeParticipant>;
    updateStatus(hike_id: number, user_id: number, status: string): Promise<boolean>;
    deleteByHike(hike_id: number): Promise<boolean>;
    deleteOne(hike_id: number,  user_id: number): Promise<boolean>;
    countConfirmedByHike(hike_id: number): Promise<number>;
}