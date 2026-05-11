import { useEffect, useState } from "react";
import type { Ascent } from "../../types/ascents/Ascent";
import type { IAscentAPIService } from "../../api_services/ascents/IAscentAPIService";

type AscentsPageProps = {
    ascentApi: IAscentAPIService;
};

export default function AscentsPage({ ascentApi }: AscentsPageProps){
    const [ascents, setAscents] = useState<Ascent[]>([]);
    const [trailId, setTrailId] = useState("");
    const [ascentDate, setAscentDate] = useState("");
    const [durationMin, setDurationMin] = useState("");
    const [note, setNote] = useState("");
    const [rating, setRating] = useState("");
    const [message, setMessage] = useState("");

    const loadAscents = async () => {
        const data = await ascentApi.getAll();
        setAscents(data);
    };

    useEffect(() => {
        loadAscents();
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
        await loadAscents();
    };

    const handleDelete = async (id: number) => {
        const success = await ascentApi.remove(id);

        if (!success){
            setMessage("Failed to delete ascent.");
            return;
        }

        setMessage("Ascent deleted successfully.");
        await loadAscents();
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
                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="Trail ID"
                    value={trailId}
                    onChange={(e) => setTrailId(e.target.value)}
                />

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
                        <p className="font-bold">Trail ID: {ascent.trail_id}</p>
                        <p className="text-gray-600">
                            Date: {String(ascent.ascent_date).slice(0, 10)}
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