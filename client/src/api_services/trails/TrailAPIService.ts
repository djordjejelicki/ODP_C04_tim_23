import { apiClient } from "../apiClient";
import type { Trail } from "../../types/trails/Trail";
import type { TrailDetails } from "../../types/trails/TrailDetails";
import type { ITrailAPIService } from "./ITrailAPIService";

export const trailApi: ITrailAPIService = {
    async getAll(): Promise<Trail[]> {
        try{
            const res = await apiClient.get<Trail[]>("trails");
            return res.data;
        } catch(error){
            console.error("Error loading trails: ", error);
            return [];
        }    
    },
    async getById(id: number): Promise<TrailDetails | null> {
        try{
            const res = await apiClient.get<TrailDetails>(`trails/${id}`);
            return res.data;
        } catch(error){
            console.error("Error loading trail details: ", error);
            return null;
        }
    },
}