import { useEffect, useState } from "react";
import type { Trail } from "../../types/trails/Trail";
import type { ITrailAPIService } from "../../api_services/trails/ITrailAPIService";
import { TrailCard } from "../../components/trails/TrailCard";

type TrailsPageProps = {
    trailApi: ITrailAPIService;
};

export default function TrailsPage({ trailApi }: TrailsPageProps) {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTrails = async () => {
            const data = await trailApi.getAll();
            setTrails(data);
            setIsLoading(false);
        };

        loadTrails();
    }, [trailApi])

    return (
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Trail Catalog</h1>
                <p className="text-gray-600 mt-2">
                    Explore available hiking trails.
                </p>
                </div>

                {isLoading ? (
                <p className="text-gray-600">Loading trails...</p>
                ) : trails.length === 0 ? (
                <p className="text-gray-600">No trails found.</p>
                ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {trails.map((trail) => (
                    <TrailCard key={trail.id} trail={trail} />
                    ))}
                </div>
                )}
            </section>
        </main> 
    );
}