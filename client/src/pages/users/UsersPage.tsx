import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { IUsersAPIService } from "../../api_services/users/IUsersAPIService";
import type { PublicUser } from "../../types/users/PublicUser";
import { getAvatarUrl } from "../../helpers/get_avatar_url";
import { useAuth } from "../../hooks/auth/useAuthHook";


type UsersPageProps = {
    usersApi: IUsersAPIService;
};

export default function UsersPage({ usersApi }: UsersPageProps) {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            const data = await usersApi.searchPublic("");
            setUsers(data);
        };

        loadUsers();
    }, [usersApi])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (query.trim().length === 1){
            setMessage("Enter at least 2 characters.");
            return;
        }

        const data = await usersApi.searchPublic(query);
        setUsers(data);

        if (data.length === 0){
            setMessage("No users found.");
        }
    };

    const handleInvite = (username: string) => {
        navigate(`/hikes?inviteUsername=${encodeURIComponent(username)}`);
    };

    const visibleUsers = user ? users.filter((item) => item.id !== user.id) : users;

    return(
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Users
                </h1>

                <p className="text-gray-600 mt-2">
                    Search public user profiles.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mt-8 bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-3"
                >
                    <input
                        className="flex-1 rounded-lg border px-3 py-2"
                        placeholder="Search by username, first name or last name"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <button className="rounded-lg bg-orange-700 text-white px-5 py-2 font-semibold hover:bg-orange-800">
                        Search
                    </button>
                </form>

                {message && (
                    <div className="mt-4 rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                        {message}
                    </div>
                )}

                <div className="mt-8 grid gap-4">
                    {visibleUsers.map((publicUser) => (
                        <article
                            key={publicUser.id}
                            className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={getAvatarUrl(publicUser.avatar_url)}
                                    alt={publicUser.username}
                                    className="w-16 h-16 rounded-full object-cover border"
                                />

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {publicUser.first_name} {publicUser.last_name}
                                    </h2>

                                    <p className="text-orange-700 font-semibold">
                                        @{publicUser.username}
                                    </p>

                                    {publicUser.bio && (
                                        <p className="text-gray-600 mt-1">
                                            {publicUser.bio}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to={`/users/${publicUser.id}`}
                                    className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
                                >
                                    View profile
                                </Link>

                                {isAuthenticated ? (
                                    <button
                                        onClick={() => handleInvite(publicUser.username)}
                                        className="rounded-lg bg-orange-700 text-white px-4 py-2 hover:bg-orange-800"
                                    >
                                        Invite to hike
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="rounded-lg bg-gray-200 text-gray-800 px-4 py-2 hover:bg-gray-300"
                                    >
                                        Login to invite
                                    </Link>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}