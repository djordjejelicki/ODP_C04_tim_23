import axios from "axios";
import type { Trail } from "../../types/trails/Trail";
import type { ITrailAPIService } from "./ITrailAPIService";

const API_URL = import.meta.env.VITE_API_URL + "trails";

export const trailApi: ITrailAPIService = {
    async getAll(): Promise<Trail[]> {
        try{
            const res = await axios.get<Trail[]>(API_URL);
            return res.data;
        } catch(error){
            console.error("Error loading trails:", error);
            return [];
        }    
    },
}