import { apiClient } from "../apiClient";
import type { IHikeAPIService } from "./IHikeAPIService";
import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipant";
import type { HikeWithUserStatus } from "../../types/hikes/HikeWithUserStatus";

export const hikeApi: IHikeAPIService = {
    async getAll(): Promise<HikeWithUserStatus[]> {
        try{
            const res = await apiClient.get<HikeWithUserStatus[]>("hikes");
            return res.data;
        } catch(error){
            console.error("Error loading hikes: ", error);
            return [];
        }
    },

    async create(
        trail_id: number, 
        name: string, 
        description: string | null, 
        scheduled_at: string, 
        max_participants: number
    ): Promise<boolean> {
        try{
            await apiClient.post("hikes", {
                trail_id,
                name,
                description,
                scheduled_at,
                max_participants
            });
            return true;
        } catch(error){
            console.log("Error creating hike: ", error);
            return false;
        }
    },

    async invite(hike_id: number, username: string): Promise<boolean> {
        try{
            await apiClient.post(`hikes/${hike_id}/invite`, {username});
            return true;
        } catch(error){
            console.error("Error inviting participant: ", error);
            return false;
        }
    },

    async respond(hike_id: number, status: HikeParticipantStatus): Promise<boolean> {
        try{
            await apiClient.patch(`hikes/${hike_id}/respond`, {status});
            return true;
        } catch(error){
            console.error("Error responding to hike invite: ", error);
            return false;
        }
    },

};