import { DashBoardStatsDto } from "../../DTOs/dashboard/DashBoardStatsDto";

export interface IDashboardService {
    getStats(user_id: number): Promise<DashBoardStatsDto>;
}