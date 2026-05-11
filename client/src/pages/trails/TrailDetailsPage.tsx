import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { TrailDetails } from "../../types/trails/TrailDetails";
import type { ITrailAPIService } from "../../api_services/trails/ITrailAPIService";
import type { IMyTrailAPIService } from "../../api_services/my_trails/IMyTrailAPIService";
import type { UserTrail } from "../../types/my_trails/UserTrail";
import { useAuth } from "../../hooks/auth/useAuthHook";


type TrailDetailsPageProps = {
    trailApi: ITrailAPIService;
    myTrailApi: IMyTrailAPIService;
};

export default function TrailDetailsPage({trailApi, myTrailApi}: TrailDetailsPageProps) {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [myTrail, setMyTrail] = useState<UserTrail | null>(null);
    const [message, setMessage] = useState("");
    const [trail, setTrail] = useState<TrailDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTrail = async () => {
            if (!id) return;

            const data = await trailApi.getById(Number(id));
            setTrail(data);
            if (isAuthenticated && data){
                const myTrails = await myTrailApi.getAll();
                const existing = myTrails.find((item) => item.trail_id === data.id) ?? null;
                setMyTrail(existing);
            }
            setIsLoading(false);
        };

        loadTrail();
    }, [id, trailApi, myTrailApi, isAuthenticated]);

    const handleAddToMyTrails = async () => {
        if (!trail) return;

        const success = await myTrailApi.add(trail.id, "want_to_hike");

        if (!success) {
            setMessage("Failed to add trail to your list.");
            return;
        }

        setMyTrail({
            user_id: 0,
            trail_id: trail.id,
            status: "want_to_hike",
            added_at: new Date().toISOString(),
        });

        setMessage("Trail added to your list");
    };

    const handleMarkCompleted = async () => {
        if (!trail) return;

        const success = await myTrailApi.updateStatus(trail.id, "completed");

        if (!success) {
            setMessage("Failed to update trail status.");
            return;
        }

        setMyTrail({
            user_id: myTrail?.user_id ?? 0,
            trail_id: trail.id,
            status: "completed",
            added_at: myTrail?.added_at ?? null
        });

        setMessage("Trail marked as completed.");

    };

    const handleRemoveFromMyTrails = async () => {
        if (!trail) return;

        const success = await myTrailApi.remove(trail.id);

        if (!success){
            setMessage("Failed to remove trail from your list.");
            return;
        }

        setMyTrail(null);
        setMessage("Trail removed from your list.");
    };

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
                    {message && (
                        <div className="rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                            {message}
                        </div>
                    )}

                    {isAuthenticated ? (
                    <div className="flex flex-wrap gap-3">
                        {!myTrail ? (
                        <button
                            onClick={handleAddToMyTrails}
                            className="rounded-lg bg-orange-700 text-white px-5 py-2 font-semibold hover:bg-orange-800"
                        >
                            Add to my trails
                        </button>
                        ) : (
                        <>
                            <span className="rounded-lg bg-slate-100 text-slate-700 px-5 py-2">
                            Status: {myTrail.status}
                            </span>

                            {myTrail.status !== "completed" && (
                            <button
                                onClick={handleMarkCompleted}
                                className="rounded-lg bg-green-700 text-white px-5 py-2 font-semibold hover:bg-green-800"
                            >
                                Mark completed
                            </button>
                            )}

                            <button
                            onClick={handleRemoveFromMyTrails}
                            className="rounded-lg bg-red-700 text-white px-5 py-2 font-semibold hover:bg-red-800"
                            >
                            Remove from my trails
                            </button>
                        </>
                        )}
                    </div>
                    ) : (
                    <p className="text-gray-600">
                        Login to add this trail to your hiking list.
                    </p>
                    )}
                </div>
            </section>
        </main> 
    );
}