import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { HikeDetails } from "../../types/hikes/HikeDetails";
import type { IHikeAPIService } from "../../api_services/hikes/IHikeAPIService";
import { formatDate } from "../../helpers/format_date";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { validateHike } from "../../validators/hikeValidator";

type HikeDetailsPageProps = {
    hikeApi: IHikeAPIService;
};

export default function HikeDetailsPage({ hikeApi }: HikeDetailsPageProps){
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    
    const [details, setDetails] = useState<HikeDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editScheduledAt, setEditScheduledAt] = useState("");
    const [editMaxParticipants, setEditMaxParticipants] = useState("");
    

    const loadDetails = async () => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        const data = await hikeApi.getById(Number(id));
        setDetails(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadDetails();
    }, [id, hikeApi]);

    const handleCancel = async () => {
        if (!details) return;

        const result = await hikeApi.cancel(details.id);

        if(!result.success){
            setMessage(result.message);
            return;
        }

        navigate("/hikes");
    }

    const handleRemoveParticipant = async (userId: number) => {
        if (!details) return;

        const result = await hikeApi.removeParticipant(details.id, userId);

        if(!result.success){
            setMessage(result.message);
            return;
        }

        await loadDetails();
        setMessage(result.message);
    }

    const startEdit = () => {
        if (!details) return;

        setEditName(details.name);
        setEditDescription(details.description ?? "");
        setEditScheduledAt(String(details.scheduled_at).slice(0, 16));
        setEditMaxParticipants(String(details.max_participants));
        setIsEditing(true);
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!details) return;

        const validation = validateHike(
            details.trail_id,
            editName,
            editDescription || null,
            editScheduledAt,
            Number(editMaxParticipants)
        );
        if (!validation.valid){
            setMessage(validation.message);
            return;
        }

        const result = await hikeApi.update(
            details.id,
            details.trail_id,
            editName,
            editDescription || null,
            editScheduledAt,
            Number(editMaxParticipants)
        );

        if (!result.success) {
            setMessage(result.message);
            return;
        }

        await loadDetails();
        setIsEditing(false);
        setMessage(result.message);
    }

    if (isLoading){
        return (
            <main className="min-h-screen bg-slate-100 p-10">
                <p>Loading hike...</p>
            </main>
        );
    }

    if (!details) {
        return (
            <main className="min-h-screen bg-slate-100 p-10">
                <p>Hike not found or access denied.</p>
            </main>
        );
    }

    const isOrganizer = user?.id === details.organizer_id;

    return (
         <main className="min-h-screen bg-slate-100">
            <section className="max-w-5xl mx-auto px-6 py-10">
                <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {details.name}
                            </h1>

                            <p className="text-gray-600 mt-2">
                                {details.description}
                            </p>
                        </div>

                        {isOrganizer && (
                             <div className="flex gap-3">
                                <button
                                    onClick={startEdit}
                                    className="rounded-lg bg-gray-900 text-white px-5 py-2 font-semibold hover:bg-gray-800"
                                >
                                    Edit hike
                                </button>

                                <button
                                    onClick={handleCancel}
                                    className="rounded-lg bg-red-700 text-white px-5 py-2 font-semibold hover:bg-red-800"
                                >
                                    Cancel hike
                                </button>
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className="rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                            {message}
                        </div>
                    )}

                    {isEditing && (
                        <form
                            onSubmit={handleUpdate}
                            className="bg-slate-100 rounded-2xl p-5 grid gap-4 md:grid-cols-2"
                        >
                            <input
                                className="rounded-lg border px-3 py-2"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Hike name"
                            />

                            <input
                                type="datetime-local"
                                className="rounded-lg border px-3 py-2"
                                value={editScheduledAt}
                                onChange={(e) => setEditScheduledAt(e.target.value)}
                            />

                            <input
                                className="rounded-lg border px-3 py-2"
                                value={editMaxParticipants}
                                onChange={(e) => setEditMaxParticipants(e.target.value)}
                                placeholder="Max participants"
                            />

                            <textarea
                                className="rounded-lg border px-3 py-2 md:col-span-2"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Description"
                            />

                            <div className="md:col-span-2 flex gap-3">
                                <button className="rounded-lg bg-orange-700 text-white px-5 py-2 font-semibold hover:bg-orange-800">
                                    Save changes
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="rounded-lg bg-gray-200 text-gray-800 px-5 py-2 font-semibold hover:bg-gray-300"
                                >
                                    Cancel edit
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-slate-100 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Trail</p>
                            <p className="font-bold">{details.trail_name}</p>
                        </div>

                        <div className="bg-slate-100 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Organizer</p>
                            <p className="font-bold">{details.organizer_username}</p>
                        </div>

                        <div className="bg-slate-100 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Scheduled at</p>
                            <p className="font-bold">
                                {formatDate(details.scheduled_at)}
                            </p>
                        </div>

                        <div className="bg-slate-100 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Max participants</p>
                            <p className="font-bold">
                                {details.max_participants}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Participants
                        </h2>

                        {details.participants.length === 0 ? (
                            <p className="text-gray-600">
                                No participants invited yet.
                            </p>
                        ) : (
                            <div className="grid gap-3">
                                {details.participants.map((participant) => (
                                    <div
                                        key={participant.user_id}
                                        className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                                    >
                                        <div>

                                            <p className="font-semibold">
                                                {participant.username}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Responded at:{" "}
                                                {formatDate(participant.responded_at)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-sm font-semibold">
                                                {participant.status}
                                            </span>

                                            {isOrganizer && (
                                                <button
                                                    onClick={() =>
                                                        handleRemoveParticipant(
                                                            participant.user_id
                                                        )
                                                    }
                                                    className="rounded-lg bg-red-700 text-white px-3 py-1 text-sm hover:bg-red-800"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}