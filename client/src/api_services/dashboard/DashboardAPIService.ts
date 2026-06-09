import { apiClient } from "../apiClient";
import type { DashboardStats } from "../../types/dashboard/DashboardStats";
import type { IDashboardAPIService } from "./IDashboardAPIService";

export const dashboardApi: IDashboardAPIService = {
    async getStats(): Promise<DashboardStats> {
        try{
            const res = await apiClient.get<DashboardStats>("dashboard/stats");
            return res.data;
        } catch (error){
            console.log("Error loading dashboard stats: ", error);
            return {
                total_completed_trails: 0,
                total_distance_km: 0,
                total_elevation_m: 0,
                favorite_mountain: ""
            };
        }
    },
};