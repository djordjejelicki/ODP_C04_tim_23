import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { TrailDetails } from "../../types/trails/TrailDetails";
import type { ITrailAPIService } from "../../api_services/trails/ITrailAPIService";

type TrailDetailsPageProps = {
    trailApi: ITrailAPIService;
};

export default function TrailDetailsPage({trailApi}: TrailDetailsPageProps) {
    const { id } = useParams();

    const [trail, setTrail] = useState<TrailDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTrail = async () => {
            if (!id) return;

            const data = await trailApi.getById(Number(id));
            setTrail(data);
            setIsLoading(false);
        };

        loadTrail();
    }, [id, trailApi]);

    if (isLoading){
        return(
            <main className="min-h-screen bg-slate-100 p-10">
                <p>Loading trail...</p>
            </main> 
        );
    }

    if (!trail) {
        return(
            <main className="min-h-screen bg-slate-100 p-10">
                <p>Trail not found.</p>
            </main> 
        );
    }

    return(
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-5xl mx-auto px-6 py-10">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <img
                    src={trail.image_url}
                    alt={trail.name}
                    className="w-full h-96 object-cover"
                />

                <div className="p-8 space-y-6">
                    <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        {trail.name}
                    </h1>

                    <p className="text-gray-600 mt-3">
                        {trail.description}
                    </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-100 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Length</p>
                        <p className="font-bold">
                        {trail.length_km.toFixed(2)} km
                        </p>
                    </div>

                    <div className="bg-slate-100 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Elevation</p>
                        <p className="font-bold">
                        {trail.elevation_m} m
                        </p>
                    </div>

                    <div className="bg-slate-100 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-bold">
                        {trail.est_duration_min} min
                        </p>
                    </div>

                    <div className="bg-slate-100 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Difficulty</p>
                        <p className="font-bold capitalize">
                        {trail.difficulty}
                        </p>
                    </div>
                    </div>

                    <div>
                    <h2 className="text-2xl font-bold mb-4">
                        Terrain tags
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        {trail.terrain_tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium"
                        >
                            {tag.name}
                        </span>
                        ))}
                    </div>
                    </div>
                </div>
                </div>
            </section>
        </main> 
    );
}