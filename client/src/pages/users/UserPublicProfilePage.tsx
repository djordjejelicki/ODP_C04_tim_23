import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { IUsersAPIService } from "../../api_services/users/IUsersAPIService";
import type { PublicUser } from "../../types/users/PublicUser";
import { getAvatarUrl } from "../../helpers/get_avatar_url";
import { useAuth } from "../../hooks/auth/useAuthHook";

type UserPublicProfilePageProps = {
    usersApi: IUsersAPIService;
};

export default function UserPublicProfilePage({ usersApi }: UserPublicProfilePageProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [user, setUser] = useState<PublicUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }
            
            const data =  await usersApi.getPublicById(Number(id));
            setUser(data);
            setIsLoading(false);
        };

        loadUser();
    }, [id, usersApi]);

    const handleInvite = () => {
        if (!user) return;
        navigate(`/hikes?inviteUsername=${encodeURIComponent(user.username)}`);
    };

    if (isLoading) {
        return(
            <main className="min-h-screen bg-slate-100 p-10">
                <p>Loading user profile...</p>
            </main>
        );
    }

    if (!user){
        return (
            <main className="min-h-screen bg-slate-100 p-10">
                <p>User not found.</p>
            </main>
        );
    }

    return(
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-4xl mx-auto px-6 py-10">
                <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row gap-8 items-center">
                    <img
                        src={getAvatarUrl(user.avatar_url)}
                        alt={user.username}
                        className="w-36 h-36 rounded-full object-cover border-4 border-orange-100"
                    />

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-gray-900">
                            {user.first_name} {user.last_name}
                        </h1>

                        <p className="text-orange-700 font-semibold mt-1">
                            @{user.username}
                        </p>

                        {user.bio && (
                            <p className="text-gray-600 mt-4">
                                {user.bio}
                            </p>
                        )}

                        <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                            {isAuthenticated ? (
                                <button
                                    onClick={handleInvite}
                                    className="rounded-lg bg-orange-700 text-white px-5 py-2 font-semibold hover:bg-orange-800"
                                >
                                    Invite to hike
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="rounded-lg bg-orange-700 text-white px-5 py-2 font-semibold hover:bg-orange-800"
                                >
                                    Login to invite
                                </Link>
                            )}

                            <Link
                                to="/users"
                                className="rounded-lg bg-gray-200 text-gray-800 px-5 py-2 font-semibold hover:bg-gray-300"
                            >
                                Back to users
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}