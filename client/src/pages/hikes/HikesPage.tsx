import React, { useEffect, useState } from "react";
import type { Hike } from "../../types/hikes/Hike";
import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipant";
import type { IHikeAPIService } from "../../api_services/hikes/IHikeAPIService";

type HikesPageProps = {
    hikeApi: IHikeAPIService;
};

export default function HikesPage({ hikeApi }: HikesPageProps){
    const [hikes, setHikes] = useState<Hike[]>([]);
    const [trailId, setTrailId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [inviteHikeId, setInviteHikeId] = useState("");
    const [inviteUserId, setInviteUserId] = useState("");
    const [message, setMessage] = useState("");

    const loadHikes = async () => {
        const data = await hikeApi.getAll();
        setHikes(data);
    };

    useEffect(() => {
        loadHikes();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const success = await hikeApi.create(
            Number(trailId),
            name,
            description || null,
            scheduledAt,
            Number(maxParticipants)
        );

        if (!success) {
            setMessage("Failed to create hike.");
            return;
        }

        setTrailId("");
        setName("");
        setDescription("");
        setScheduledAt("");
        setMaxParticipants("");
        setMessage("Hike created successfully.");
        await loadHikes();
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const success = await hikeApi.invite(
            Number(inviteHikeId),
            Number(inviteUserId)
        );

        if (!success){
            setMessage("Failed to invite participant.");
            return;
        }

        setInviteHikeId("");
        setInviteUserId("");
        setMessage("Participant invited successfully.");
    };

    const handleRespond = async (
        hikeId: number,
        status: HikeParticipantStatus
    ) => {
        const success = await hikeApi.respond(hikeId, status);

        if (!success) {
            setMessage("Failed ti respond to invite.");
            return;
        }

        setMessage(`Invite ${status}`);
    };

    return(
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">Hikes</h1>
                <p className="text-gray-600 mt-2">
                Create group hikes and manage invitations.
                </p>

                <form
                onSubmit={handleCreate}
                className="mt-8 bg-white rounded-2xl shadow-md p-6 grid gap-4 md:grid-cols-2"
                >
                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="Trail ID"
                    value={trailId}
                    onChange={(e) => setTrailId(e.target.value)}
                />

                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="Hike name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="datetime-local"
                    className="rounded-lg border px-3 py-2"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                />

                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="Max participants"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                />

                <textarea
                    className="rounded-lg border px-3 py-2 md:col-span-2"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button className="md:col-span-2 rounded-lg bg-orange-700 text-white py-2 font-semibold hover:bg-orange-800">
                    Create hike
                </button>
                </form>

                <form
                onSubmit={handleInvite}
                className="mt-6 bg-white rounded-2xl shadow-md p-6 grid gap-4 md:grid-cols-3"
                >
                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="Hike ID"
                    value={inviteHikeId}
                    onChange={(e) => setInviteHikeId(e.target.value)}
                />

                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="User ID to invite"
                    value={inviteUserId}
                    onChange={(e) => setInviteUserId(e.target.value)}
                />

                <button className="rounded-lg bg-gray-900 text-white py-2 font-semibold hover:bg-gray-800">
                    Invite user
                </button>
                </form>

                {message && (
                <div className="mt-4 rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                    {message}
                </div>
                )}

                <div className="mt-8 grid gap-4">
                {hikes.length === 0 ? (
                    <p className="text-gray-600">No hikes yet.</p>
                ) : (
                    hikes.map((hike) => (
                    <div
                        key={hike.id}
                        className="bg-white rounded-2xl shadow-md p-5 space-y-3"
                    >
                        <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {hike.name}
                        </h2>
                        <p className="text-gray-600">{hike.description}</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-3 text-sm text-gray-700">
                        <span>Hike ID: {hike.id}</span>
                        <span>Trail ID: {hike.trail_id}</span>
                        <span>
                            Date: {String(hike.scheduled_at).replace("T", " ").slice(0, 16)}
                        </span>
                        <span>Max: {hike.max_participants}</span>
                        </div>

                        <div className="flex gap-3">
                        <button
                            onClick={() => handleRespond(hike.id, "confirmed")}
                            className="rounded-lg bg-green-700 text-white px-4 py-2 hover:bg-green-800"
                        >
                            Confirm
                        </button>

                        <button
                            onClick={() => handleRespond(hike.id, "declined")}
                            className="rounded-lg bg-red-700 text-white px-4 py-2 hover:bg-red-800"
                        >
                            Decline
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