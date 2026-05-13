import { useEffect, useState } from "react";
import type { Ascent } from "../../types/ascents/Ascent";
import type { AscentDetails } from "../../types/ascents/AscentDetails";
import type { IAscentAPIService } from "../../api_services/ascents/IAscentAPIService";
import type { IMyTrailAPIService } from "../../api_services/my_trails/IMyTrailAPIService";
import type { UserTrailDetails } from "../../types/my_trails/UserTrailDetails";
import { formatDate } from "../../helpers/format_date";

type AscentsPageProps = {
    ascentApi: IAscentAPIService;
    myTrailApi: IMyTrailAPIService;
};

export default function AscentsPage({ ascentApi, myTrailApi }: AscentsPageProps){
    const [ascents, setAscents] = useState<AscentDetails[]>([]);
    const [myTrails, setMyTrails] = useState<UserTrailDetails[]>([]);
    const [trailId, setTrailId] = useState("");
    const [ascentDate, setAscentDate] = useState("");
    const [durationMin, setDurationMin] = useState("");
    const [note, setNote] = useState("");
    const [rating, setRating] = useState("");
    const [message, setMessage] = useState("");

    const loadData = async () => {
        const ascentsData = await ascentApi.getAll();
        const trailsData = await myTrailApi.getAll();
        setAscents(ascentsData);
        setMyTrails(trailsData);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const success = await ascentApi.create(
            Number(trailId),
            ascentDate,
            Number(durationMin),
            note || null,
            Number(rating)
        );

        if (!success){
            setMessage("Failed to create ascent. Make sure the trail is on your list.");
            return;
        }

        setTrailId("");
        setAscentDate("");
        setDurationMin("");
        setNote("");
        setRating("");
        setMessage("Ascent created successfully.");
        await loadData();
    };

    const handleDelete = async (id: number) => {
        const success = await ascentApi.remove(id);

        if (!success){
            setMessage("Failed to delete ascent.");
            return;
        }

        setMessage("Ascent deleted successfully.");
        await loadData();
    };

    return (
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">My Ascents</h1>
                <p className="text-gray-600 mt-2">Track completed hiking ascents.</p>

                <form
                onSubmit={handleSubmit}
                className="mt-8 bg-white rounded-2xl shadow-md p-6 grid gap-4 md:grid-cols-2"
                >
                <select
                    className="rounded-lg border px-3 py-2"
                    value={trailId}
                    onChange={(e) => setTrailId(e.target.value)}
                >
                    <option value="">Choose trail</option>
                    {myTrails.map((trail) => (
                        <option key={trail.trail_id} value={trail.trail_id}>
                            {trail.trail_name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    className="rounded-lg border px-3 py-2"
                    value={ascentDate}
                    onChange={(e) => setAscentDate(e.target.value)}
                />

                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="Duration in minutes"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                />

                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="Rating 1-10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                />

                <textarea
                    className="rounded-lg border px-3 py-2 md:col-span-2"
                    placeholder="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <button className="md:col-span-2 rounded-lg bg-orange-700 text-white py-2 font-semibold hover:bg-orange-800">
                    Add ascent
                </button>
                </form>

                {message && (
                <div className="mt-4 rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                    {message}
                </div>
                )}

                <div className="mt-8 grid gap-4">
                {ascents.length === 0 ? (
                    <p className="text-gray-600">No ascents yet.</p>
                ) : (
                    ascents.map((ascent) => (
                    <div
                        key={ascent.id}
                        className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between"
                    >
                        <div>
                        <p className="font-bold">{ascent.trail_name}</p>
                        <p className="text-gray-600">
                            Date: {formatDate(ascent.ascent_date)}
                        </p>
                        <p className="text-gray-600">
                            Duration: {ascent.duration_min} min
                        </p>
                        <p className="text-gray-600">Rating: {ascent.rating}/10</p>
                        {ascent.note && (
                            <p className="text-gray-500 mt-1">{ascent.note}</p>
                        )}
                        </div>

                        <button
                        onClick={() => handleDelete(ascent.id)}
                        className="rounded-lg bg-red-700 text-white px-4 py-2 hover:bg-red-800"
                        >
                        Delete
                        </button>
                    </div>
                    ))
                )}
                </div>
            </section>
        </main>
    );
};