import { useEffect, useState } from "react";
import type { UserDto } from "../../types/users/UserDto";
import type { IUsersAPIService } from "../../api_services/users/IUsersAPIService";
import { getAvatarUrl } from "../../helpers/get_avatar_url";

type ProfilePageProps = {
    usersApi: IUsersAPIService;
};

export default function ProfilePage({ usersApi }: ProfilePageProps){
    const [user, setUser] = useState<UserDto | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const data = await usersApi.getMe();
            setUser(data);
        };

        loadUser();
    }, [usersApi]);

    if (!user){
        return(
            <main className="min-h-screen bg-slate-100 p-10">
                <p>Loading profile...</p>
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

                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            {user.first_name} {user.last_name}
                        </h1>

                        <p className="text-orange-700 font-semibold mt-1">
                            @{user.username}
                        </p>

                        <p className="text-gray-600 mt-2">
                            {user.email}
                        </p>

                        <span className="inline-block mt-4 rounded-full bg-orange-100 text-orange-800 px-4 py-2 font-semibold">
                            {user.role}
                        </span>
                    </div>
                </div>
            </section>
        </main> 
    );
}