import type { DashboardStats } from "../../types/dashboard/DashboardStats";

export interface IDashboardAPIService {
    getStats(): Promise<DashboardStats>;
}