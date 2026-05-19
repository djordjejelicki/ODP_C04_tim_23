import { useEffect, useState } from "react";
import type { Trail } from "../../types/trails/Trail";
import type { ITrailAPIService } from "../../api_services/trails/ITrailAPIService";
import { TrailCard } from "../../components/trails/TrailCard";

type TrailsPageProps = {
    trailApi: ITrailAPIService;
};

type SortOption = 
    | "name"
    | "rating_desc"
    | "rating_asc"
    | "length_asc"
    | "length_desc"
    | "elevation_asc"
    | "elevation_desc";

export default function TrailsPage({ trailApi }: TrailsPageProps) {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("name");

    useEffect(() => {
        const loadTrails = async () => {
            const data = await trailApi.getAll();
            setTrails(data);
            setIsLoading(false);
        };

        loadTrails();
    }, [trailApi])

    const sortedTrails = [...trails].sort((a,b) => {
        if (sortBy === "rating_desc"){
            return (b.average_rating ?? 0) - (a.average_rating ?? 0);
        }
        if (sortBy === "length_asc"){
            return a.length_km - b.length_km;
        }
        if (sortBy === "length_desc"){
            return b.length_km - a.length_km;
        }
        if (sortBy === "elevation_asc"){
            return a.elevation_m - b.elevation_m;
        }
        if (sortBy === "elevation_desc"){
            return b.elevation_m - a.elevation_m;
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Trail Catalog</h1>
                    <p className="text-gray-600 mt-2">
                        Explore available hiking trails.
                    </p>
                    <div className="mt-4 max-w-xs">
                        <select
                            className="w-full rounded-lg border px-3 py-2"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                        >
                            <option value="name">Sort by name</option>
                            <option value="rating_desc">Sort by rating</option>
                            <option value="length_asc">Length ascending</option>
                            <option value="length_desc">Length descending</option>
                            <option value="elevation_asc">Elevation ascending</option>
                            <option value="elevation_desc">Elevation descending</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                <p className="text-gray-600">Loading trails...</p>
                ) : trails.length === 0 ? (
                <p className="text-gray-600">No trails found.</p>
                ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedTrails.map((trail) => (
                    <TrailCard key={trail.id} trail={trail} />
                    ))}
                </div>
                )}
            </section>
        </main> 
    );
}