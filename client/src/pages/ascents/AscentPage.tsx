import { useEffect, useState } from "react";
import type { AscentDetails } from "../../types/ascents/AscentDetails";
import type { IAscentAPIService } from "../../api_services/ascents/IAscentAPIService";
import type { IMyTrailAPIService } from "../../api_services/my_trails/IMyTrailAPIService";
import type { UserTrailDetails } from "../../types/my_trails/UserTrailDetails";
import { formatDate } from "../../helpers/format_date";
import { validateAscent } from "../../validators/ascentValidator";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";

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
    const [editingId, setEditingId] = useState<number | null>(null);

    const [deleteId, setDeleteId] = useState(0);

    const loadData = async () => {
        const ascentsData = await ascentApi.getAll();
        const trailsData = await myTrailApi.getAll();
        setAscents(ascentsData);
        setMyTrails(trailsData);
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setTrailId("");
        setAscentDate("");
        setDurationMin("");
        setNote("");
        setRating("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const validation = validateAscent(
            Number(trailId),
            ascentDate,
            Number(durationMin),
            note || "",
            Number(rating)
        );
        if(!validation.valid){
            setMessage(validation.message);
            return;
        }

        const result = 
            editingId === null
                ? await ascentApi.create(
                    Number(trailId),
                    ascentDate,
                    Number(durationMin),
                    note || "",
                    Number(rating)
                )
                : await ascentApi.update(
                    editingId,
                    ascentDate,
                    Number(durationMin),
                    note || "",
                    Number(rating),
                    Number(trailId)
                );

        if (!result.success){
            setMessage(result.message);
            return;
        }

        setMessage(result.message);
        resetForm();
        await loadData();
    };

    const handleDelete = async (id: number) => {
        const result = await ascentApi.remove(id);

        if (!result.success){
            setMessage(result.message);
            return;
        }

        setMessage(result.message);
        await loadData();
    };

    const handleEdit = (ascent: AscentDetails) => {
        setEditingId(ascent.id);
        setTrailId(String(ascent.trail_id));
        setAscentDate(String(ascent.ascent_date).slice(0, 10));
        setDurationMin(String(ascent.duration_min));
        setNote(ascent.note);
        setRating(String(ascent.rating));
        setMessage("");
    };

    return (
            <main className="min-h-screen bg-slate-100">
                {deleteId !== 0 &&  (
                    <ConfirmDialog
                        title="Delete ascent"
                        message="Are you sure you want to delete this ascent?"
                        confirmText="Delete"
                        cancelText="Cancel"
                        onCancel={() => setDeleteId(0)}
                        onConfirm={async () => {
                            await handleDelete(deleteId);
                            setDeleteId(0);
                        }}
                    />
                )}
                <section className="max-w-6xl mx-auto px-6 py-10">
                    <h1 className="text-4xl font-bold text-gray-900">My Ascents</h1>
                    <p className="text-gray-600 mt-2">Track completed hiking ascents.</p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 bg-white rounded-2xl shadow-md p-6 grid gap-4 md:grid-cols-2"
                    >
                        <div>
                            <select
                                disabled={editingId !== null}
                                className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
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

                            {editingId !== null && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Trail cannot be changed while editing an ascent.
                                </p>
                            )}
                        </div>

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

                        <div className="md:col-span-2 flex flex-wrap gap-3">
                            <button className="rounded-lg bg-orange-700 text-white px-5 py-2 font-semibold hover:bg-orange-800">
                                {editingId === null ? "Add ascent" : "Update ascent"}
                            </button>

                            {editingId !== null && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg bg-gray-200 text-gray-800 px-5 py-2 font-semibold hover:bg-gray-300"
                                >
                                    Cancel edit
                                </button>
                            )}
                        </div>
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
                                    className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-bold">{ascent.trail_name}</p>

                                        <p className="text-gray-600">
                                            Date: {formatDate(ascent.ascent_date)}
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

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEdit(ascent)}
                                            className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => setDeleteId(ascent.id)}
                                            className="rounded-lg bg-red-700 text-white px-4 py-2 hover:bg-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
    );
};