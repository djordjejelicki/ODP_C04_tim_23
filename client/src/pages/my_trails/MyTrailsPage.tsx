import { useEffect, useState } from "react";
import type { IMyTrailAPIService } from "../../api_services/my_trails/IMyTrailAPIService";
import type { UserTrailDetails } from "../../types/my_trails/UserTrailDetails";
import { TrailStatusColumn } from "../../components/my_trails/TrailStatusColumn"; 
import { DashboardStatsCard } from "../../components/dashboard/DashboardStatsCard";
import { dashboardApi } from "../../api_services/dashboard/DashboardAPIService";
import { USER_TRAIL_STATUS } from "../../types/my_trails/UserTrailStatus";

type MyTrailsPageProps = {
    myTrailApi: IMyTrailAPIService;
};

export default function MyTrailsPage({ myTrailApi }: MyTrailsPageProps) {
    const [items, setItems] = useState<UserTrailDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await myTrailApi.getAll();
            setItems(data);
            setIsLoading(false);
        };

        load();
    }, [myTrailApi])

    const planned = items.filter((item) => item.status == USER_TRAIL_STATUS.WANT_TO_HIKE);
    const completed = items.filter((item) => item.status == USER_TRAIL_STATUS.COMPLETED);

    return (
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">My Trails</h1>
                <DashboardStatsCard dashboardApi={dashboardApi} />
                <p className="text-gray-600 mt-2">Routes saved to your hiking list.</p>

                {isLoading ? (
                <p className="mt-8 text-gray-600">Loading...</p>
                ) : (
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <TrailStatusColumn title="Want to hike" items={planned} />
                    <TrailStatusColumn title="Completed" items={completed} />
                </div>
                )}
            </section>

        </main> 
    );
}