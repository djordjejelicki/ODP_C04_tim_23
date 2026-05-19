import { useEffect, useState } from "react";
import type { IDashboardAPIService } from "../../api_services/dashboard/IDashboardAPIService";
import type { DashboardStats } from "../../types/dashboard/DashboardStats";

type DashboardStatsCardProps = {
    dashboardApi: IDashboardAPIService;
};

export function DashboardStatsCard({ dashboardApi }: DashboardStatsCardProps){
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            const data = await dashboardApi.getStats();
            setStats(data);
        };

        loadStats();
    }, [dashboardApi])

    if (!stats){
        return null;
    }

    return (
        <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-2xl shadow-md p-5">
                <p className="text-gray-500 text-sm">Completed trails</p>
                <p className="text-3xl font-bold text-gray-900">
                    {stats.total_completed_trails}
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-5">
                <p className="text-gray-500 text-sm">Total distance</p>
                <p className="text-3xl font-bold text-gray-900">
                    {stats.total_distance_km.toFixed(2)} km
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-5">
                <p className="text-gray-500 text-sm">Total elevation</p>
                <p className="text-3xl font-bold text-gray-900">
                    {stats.total_elevation_m} m
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-5">
                <p className="text-gray-500 text-sm">Favorite mountain</p>
                <p className="text-2xl font-bold text-gray-900">
                    {stats.favorite_mountain ?? "N/A"}
                </p>
            </div>
        </div>
    );
}