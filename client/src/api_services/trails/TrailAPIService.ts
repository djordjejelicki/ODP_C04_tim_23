import axios from "axios";
import type { Trail } from "../../types/trails/Trail";
import type { TrailDetails } from "../../types/trails/TrailDetails";
import type { ITrailAPIService } from "./ITrailAPIService";

const API_URL = import.meta.env.VITE_API_URL + "trails";

export const trailApi: ITrailAPIService = {
    async getAll(): Promise<Trail[]> {
        try{
            const res = await axios.get<Trail[]>(API_URL);
            return res.data;
        } catch(error){
            console.error("Error loading trails: ", error);
            return [];
        }    
    },
    async getById(id: number): Promise<TrailDetails | null> {
        try{
            const res = await axios.get<TrailDetails>(`${API_URL}/${id}`);
            return res.data;
        } catch(error){
            console.error("Error loading trail details: ", error);
            return null;
        }
    },
}