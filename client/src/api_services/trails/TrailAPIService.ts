import { apiClient } from "../apiClient";
import type { Trail, TrailDifficulty } from "../../types/trails/Trail";
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
    async create(
        mountain_id: number, 
        name: string, 
        description: string | null, 
        length_km: number, 
        difficulty: TrailDifficulty, 
        est_duration_min: number, 
        elevation_m: number, 
        image: File | null, 
        terrain_tag_ids: number[]
    ): Promise<boolean> {
        try{

             const formData = new FormData();

            formData.append("mountain_id", String(mountain_id));
            formData.append("name", name);
            formData.append("description", description ?? "");
            formData.append("length_km", String(length_km));
            formData.append("difficulty", difficulty);
            formData.append("est_duration_min", String(est_duration_min));
            formData.append("elevation_m", String(elevation_m));

            for (const tagId of terrain_tag_ids){
                formData.append("terrain_tag_ids", String(tagId));
            }

            if (image){
                formData.append("image", image);
            }

            await apiClient.post("trails", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
           
            return true;
        } catch(error){
            console.error("Error creating trail: ", error);
            return false;
        }
    },
    async update(
        id: number, 
        mountain_id: number, 
        name: string, 
        description: string | null, 
        length_km: number, 
        difficulty: TrailDifficulty, 
        est_duration_min: number, 
        elevation_m: number,
        image: File | null, 
        image_url: string, 
        terrain_tag_ids: number[]
    ): Promise<boolean> {
        try{
            const formData = new FormData();

            formData.append("mountain_id", String(mountain_id));
            formData.append("name", name);
            formData.append("description", description ?? "");
            formData.append("length_km", String(length_km));
            formData.append("difficulty", difficulty);
            formData.append("est_duration_min", String(est_duration_min));
            formData.append("elevation_m", String(elevation_m));
            formData.append("image_url", image_url);

            for (const tagId of terrain_tag_ids){
                formData.append("terrain_tag_ids", String(tagId));
            }

            if (image) {
                formData.append("image", image);
            }

            await apiClient.put(`trails/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return true;
        } catch(error){
            console.error("Error updating trail: ", error);
            return false;
        }
    },
    async remove(id: number): Promise<boolean> {
        try{
            await apiClient.delete(`trails/${id}`);
            return true;
        } catch(error){
            console.error("Error deleting trails: ", error);
            return false;
        }
    },
}