import { useEffect, useState } from "react";
import type { UserDto } from "../../types/users/UserDto";
import type { IUsersAPIService } from "../../api_services/users/IUsersAPIService";
import { getAvatarUrl } from "../../helpers/get_avatar_url";
import { validateChangePassword, validateUpdateProfile } from "../../validators/userValidator";

type ProfilePageProps = {
    usersApi: IUsersAPIService;
};

export default function ProfilePage({ usersApi }: ProfilePageProps){
    const [user, setUser] = useState<UserDto | null>(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const data = await usersApi.getMe();
            setUser(data);

            if (data) {
                setUsername(data.username);
                setEmail(data.email);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setBio(data.bio ?? "");
            }
        };

        loadUser();
    }, [usersApi]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const validation = validateUpdateProfile(
            username,
            email,
            firstName,
            lastName,
            bio || null
        );

        if (!validation.valid){
            setMessage(validation.message);
            return;
        }

        const result = await usersApi.updateProfile(
            username,
            email,
            firstName,
            lastName,
            bio || null,
            avatar
        );

        if (!result.success){
            setMessage(result.message);
            return;
        }

        setMessage(result.message);
        const updatedUser = await usersApi.getMe();
        setUser(updatedUser); 
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const validation = validateChangePassword(
            currentPassword,
            newPassword,
            confirmPassword
        );

        if (!validation.valid){
            setMessage(validation.message);
            return;
        }

        const result = await usersApi.changePassword(currentPassword, newPassword);

        if (!result.success) {
            setMessage(result.message);
            return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage(result.message);
    }

    if (!user){
        return(
            <main className="min-h-screen bg-slate-100 p-10">
                <p>Loading profile...</p>
            </main> 
        );
    }

    return(
       <main className="min-h-screen bg-slate-100">
            <section className="max-w-4xl mx-auto px-6 py-10 space-y-8">
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

                        {user.bio && (
                            <p className="text-gray-700 mt-4 max-w-2xl">
                                {user.bio}
                            </p>
                        )}

                        <span className="inline-block mt-4 rounded-full bg-orange-100 text-orange-800 px-4 py-2 font-semibold">
                            {user.role}
                        </span>
                    </div>
                </div>

                <form
                    onSubmit={handleUpdateProfile}
                    className="bg-white rounded-2xl shadow-md p-8 grid gap-4 md:grid-cols-2"
                >
                    <h2 className="md:col-span-2 text-2xl font-bold text-gray-900">
                        Edit profile
                    </h2>

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <textarea
                        className="rounded-lg border px-3 py-2 md:col-span-2"
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />

                    <label className="md:col-span-2 cursor-pointer rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 px-4 py-5 text-center hover:bg-orange-100 transition block">
                        <span className="block font-semibold text-orange-800">
                            {avatar ? avatar.name : "Click to choose new profile image"}
                        </span>

                        <span className="block text-sm text-orange-700 mt-1">
                            JPG, PNG or WEBP up to 5MB
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
                            className="hidden"
                        />
                    </label>

                    <button className="md:col-span-2 rounded-lg bg-orange-700 text-white py-2 font-semibold hover:bg-orange-800">
                        Save profile
                    </button>
                </form>

                <form
                    onSubmit={handleChangePassword}
                    className="bg-white rounded-2xl shadow-md p-8 grid gap-4"
                >
                    <h2 className="text-2xl font-bold text-gray-900">
                        Change password
                    </h2>

                    <input
                        type="password"
                        className="rounded-lg border px-3 py-2"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        className="rounded-lg border px-3 py-2"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        className="rounded-lg border px-3 py-2"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button className="rounded-lg bg-gray-900 text-white py-2 font-semibold hover:bg-gray-800">
                        Change password
                    </button>
                </form>

                {message && (
                    <div className="rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                        {message}
                    </div>
                )}
            </section>
        </main>
    );
}