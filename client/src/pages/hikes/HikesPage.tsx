import React, { useEffect, useState } from "react";
import type { HikeWithUserStatus } from "../../types/hikes/HikeWithUserStatus";
import { HIKE_PARTICIPANT_STATUS, type HikeParticipantStatus } from "../../types/hikes/HikeParticipantStatus";
import type { IHikeAPIService } from "../../api_services/hikes/IHikeAPIService";
import type { IMyTrailAPIService } from "../../api_services/my_trails/IMyTrailAPIService";
import type { UserTrailDetails } from "../../types/my_trails/UserTrailDetails";
import { useSearchParams } from "react-router-dom";
import { formatDate } from "../../helpers/format_date";
import { Link } from "react-router-dom";
import { validateHike } from "../../validators/hikeValidator";

type HikesPageProps = {
    hikeApi: IHikeAPIService;
    myTrailApi: IMyTrailAPIService;
};

export default function HikesPage({ hikeApi, myTrailApi }: HikesPageProps){
    const [hikes, setHikes] = useState<HikeWithUserStatus[]>([]);
    const [myTrails, setMyTrails] = useState<UserTrailDetails[]>([]);
    const [trailId, setTrailId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [inviteHikeId, setInviteHikeId] = useState("");
    const [inviteUsername, setInviteUsername] = useState("");
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();

    const loadData = async () => {
        const hikesData = await hikeApi.getAll();
        const trailsData = await myTrailApi.getAll();
        
        setHikes(hikesData);
        setMyTrails(trailsData);
    };

    useEffect(() => {
        const username = searchParams.get("inviteUsername");
        if (username){
            setInviteUsername(username);
        }

        loadData();
    }, [searchParams]);

    const organizedHikes = hikes.filter((hike) => hike.is_organizer);
    const invitationHikes = hikes.filter((hike) => !hike.is_organizer);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const validation = validateHike(
            Number(trailId),
            name,
            description || "",
            scheduledAt,
            Number(maxParticipants)
        );
        if (!validation.valid){
            setMessage(validation.message);
            return;
        }

        const result = await hikeApi.create(
            Number(trailId),
            name,
            description || "",
            scheduledAt,
            Number(maxParticipants)
        );

        if (!result.success) {
            setMessage(result.message);
            return;
        }

        setTrailId("");
        setName("");
        setDescription("");
        setScheduledAt("");
        setMaxParticipants("");
        setMessage(result.message);
        await loadData();
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const result = await hikeApi.invite(
            Number(inviteHikeId),
            inviteUsername
        );

        if (!result.success){
            setMessage(result.message);
            return;
        }

        setInviteHikeId("");
        setInviteUsername("");
        setMessage(result.message);
        await loadData();
    };

    const handleRespond = async (
        hikeId: number,
        status: HikeParticipantStatus
    ) => {
        const result = await hikeApi.respond(hikeId, status);

        if (!result.success) {
            setMessage(result.message);
            await loadData();
            return;
        }

        setMessage(result.message);
        await loadData();
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
                    <select
                        className="rounded-lg border px-3 py-2"
                        value={inviteHikeId}
                        onChange={(e) => setInviteHikeId(e.target.value)}
                    >
                        <option value="">Choose hike</option>
                        {organizedHikes.map((hike) => (
                            <option key={hike.id} value={hike.id}>
                                {hike.name} - {hike.trail_name}
                            </option>
                        ))}
                    </select>

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Username to invite"
                        value={inviteUsername}
                        onChange={(e) => setInviteUsername(e.target.value)}
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

                <div className="mt-8 grid gap-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Hikes I organize
                        </h2>

                        {organizedHikes.length === 0 ? (
                            <p className="text-gray-600">
                                You are not organizing any hikes yet.
                            </p>
                        ) : (
                            <div className="grid gap-4">
                                {organizedHikes.map((hike) => (
                                    <div
                                        key={hike.id}
                                        className="bg-white rounded-2xl shadow-md p-5 space-y-3"
                                    >
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {hike.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                {hike.description}
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-700">
                                            <span>{hike.trail_name}</span>
                                            <span>Date: {formatDate(hike.scheduled_at)}</span>
                                            <span>Max: {hike.max_participants}</span>
                                        </div>

                                        <span className="inline-flex rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold">
                                            Organizer
                                        </span>

                                        <Link
                                            to={`/hikes/${hike.id}`}
                                            className="inline-block rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
                                        >
                                            View details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Invitations
                        </h2>

                        {invitationHikes.length === 0 ? (
                            <p className="text-gray-600">
                                You do not have hike invitations.
                            </p>
                        ) : (
                            <div className="grid gap-4">
                                {invitationHikes.map((hike) => (
                                    <div
                                        key={hike.id}
                                        className="bg-white rounded-2xl shadow-md p-5 space-y-3"
                                    >
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {hike.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                {hike.description}
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-700">
                                            <span>{hike.trail_name}</span>
                                            <span>Date: {formatDate(hike.scheduled_at)}</span>
                                            <span>Max: {hike.max_participants}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-sm font-semibold">
                                                Status: {hike.current_user_status}
                                            </span>

                                            <Link
                                                to={`/hikes/${hike.id}`}
                                                className="inline-block rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
                                            >
                                                View details
                                            </Link>

                                            {hike.current_user_status === HIKE_PARTICIPANT_STATUS.INVITED && (
                                                <>
                                                    <button
                                                        onClick={() => handleRespond(hike.id, HIKE_PARTICIPANT_STATUS.CONFIRMED)}
                                                        className="rounded-lg bg-green-700 text-white px-4 py-2 hover:bg-green-800"
                                                    >
                                                        Confirm
                                                    </button>

                                                    <button
                                                        onClick={() => handleRespond(hike.id, HIKE_PARTICIPANT_STATUS.DECLINED)}
                                                        className="rounded-lg bg-red-700 text-white px-4 py-2 hover:bg-red-800"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
};