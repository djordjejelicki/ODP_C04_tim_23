import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { TrailDetails } from "../../types/trails/TrailDetails";
import type { ITrailAPIService } from "../../api_services/trails/ITrailAPIService";
import type { IMyTrailAPIService } from "../../api_services/my_trails/IMyTrailAPIService";
import type { UserTrail } from "../../types/my_trails/UserTrail";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { getImageUrl } from "../../helpers/get_image_url";
import type { IAscentAPIService } from "../../api_services/ascents/IAscentAPIService";
import type { AscentDetails } from "../../types/ascents/AscentDetails";
import { USER_TRAIL_STATUS } from "../../types/my_trails/UserTrailStatus";
import { formatDate } from "../../helpers/format_date";

type TrailDetailsPageProps = {
    trailApi: ITrailAPIService;
    myTrailApi: IMyTrailAPIService;
    ascentApi: IAscentAPIService;
};

export default function TrailDetailsPage({trailApi, myTrailApi, ascentApi}: TrailDetailsPageProps) {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [myTrail, setMyTrail] = useState<UserTrail | null>(null);
    const [message, setMessage] = useState("");
    const [trail, setTrail] = useState<TrailDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trailAscents, setTrailAscents] = useState<AscentDetails[]>([]);

    useEffect(() => {
        const loadTrail = async () => {
            if (!id) return;

            const data = await trailApi.getById(Number(id));
            setTrail(data);
            if (isAuthenticated && data.id !== 0){
                const myTrails = await myTrailApi.getAll();
                const existing = myTrails.find((item) => item.trail_id === data.id) ?? null;
                setMyTrail(existing);
                const ascents = await ascentApi.getAll();
                setTrailAscents(ascents.filter((ascent) => ascent.trail_id === data.id));
            }
            setIsLoading(false);
        };

        loadTrail();
    }, [id, trailApi, myTrailApi, ascentApi,isAuthenticated]);

    const handleAddToMyTrails = async () => {
        if (!trail) return;

        const result = await myTrailApi.add(trail.id, USER_TRAIL_STATUS.WANT_TO_HIKE);

        if (!result.success) {
            setMessage(result.message);
            return;
        }

        setMyTrail({
            user_id: 0,
            trail_id: trail.id,
            status: USER_TRAIL_STATUS.WANT_TO_HIKE,
            added_at: new Date().toISOString(),
        });

        setMessage(result.message);
    };

    const handleMarkCompleted = async () => {
        if (!trail) return;

        const result = await myTrailApi.updateStatus(trail.id, USER_TRAIL_STATUS.COMPLETED);

        if (!result.success) {
            setMessage(result.message);
            return;
        }

        setMyTrail({
            user_id: myTrail?.user_id ?? 0,
            trail_id: trail.id,
            status: USER_TRAIL_STATUS.COMPLETED,
            added_at: myTrail?.added_at ?? ""
        });

        setMessage(result.message);

    };

    const handleRemoveFromMyTrails = async () => {
        if (!trail) return;

        const result = await myTrailApi.remove(trail.id);

        if (!result.success){
            setMessage(result.message);
            return;
        }

        setMyTrail(null);
        setMessage(result.message);
    };

    if (isLoading){
        return(
            <main className="min-h-screen bg-slate-100 p-10">
                <p>Loading trail...</p>
            </main> 
        );
    }

    if (!trail || trail.id === 0) {
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
                    src={getImageUrl(trail.image_url)}
                    alt={trail.name}
                    className="w-full h-96 object-cover"
                />

                <div className="p-8 space-y-6">
                    <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        {trail.name}
                    </h1>

                    <p className="text-gray-700">
                        Mountain:{" "}
                        <span className="font-semibold">
                            {trail.mountain_name}
                        </span>
                    </p>

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

                    <p className="text-gray-700">
                        Average rating:{" "}
                        <span className="font-semibold">
                            {trail.average_rating > 0
                            ? trail.average_rating.toFixed(1)
                            : "No ratings"}
                        </span>
                    </p>

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

                    {isAuthenticated && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                Your ascents on this trail
                            </h2>

                            {trailAscents.length === 0 ? (
                                <p className="text-gray-600">
                                    You have not recorded any ascents for this trail yet.
                                </p>
                            ) : (
                                <div className="grid gap-3">
                                    {trailAscents.map((ascent) => (
                                        <div
                                            key={ascent.id}
                                            className="border rounded-xl p-4"
                                        >
                                            <p className="font-semibold">
                                                {formatDate(ascent.ascent_date)}
                                            </p>

                                            <p className="text-gray-600">
                                                Duration: {ascent.duration_min} min
                                            </p>

                                            <p className="text-gray-600">
                                                Rating: {ascent.rating}/10
                                            </p>

                                            {ascent.note && (
                                                <p className="text-gray-500 mt-1">
                                                    {ascent.note}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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

                            {myTrail.status !== USER_TRAIL_STATUS.COMPLETED && (
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