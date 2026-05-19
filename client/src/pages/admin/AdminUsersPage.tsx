import { useEffect, useState } from "react";
import type { IUsersAPIService } from "../../api_services/users/IUsersAPIService";
import type { UserDto, UserRole } from "../../types/users/UserDto";
import { usersApi } from "../../api_services/users/UsersAPIService";

type AdminUsersPageProps = {
    userApi: IUsersAPIService;
};

export default function AdminUsersPage ({ userApi }: AdminUsersPageProps) {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [message, setMessage] = useState("");

    const loadUsers = async () => {
        const data = await userApi.getAll();
        setUsers(data);
    };

    useEffect(() => {
        loadUsers();
    },[usersApi]);

    const handleRoleChange = async (id: number, role: UserRole) => {
        setMessage("");

        const success = await userApi.updateRole(id, role);
        if (!success) {
            setMessage("Failed to update user role. ");
            return;
        }

        setMessage("User role updated.");
        await loadUsers();
    };

    return(
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Manage Users
                </h1>

                <p className="text-gray-600 mt-2">
                    Review registered users and update roles.
                </p>

                {message && (
                    <div className="mt-6 rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                        {message}
                    </div>
                )}

                <div className="mt-8 overflow-x-auto bg-white rounded-2xl shadow-md">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="text-left px-4 py-3">ID</th>
                                <th className="text-left px-4 py-3">Username</th>
                                <th className="text-left px-4 py-3">Name</th>
                                <th className="text-left px-4 py-3">Email</th>
                                <th className="text-left px-4 py-3">Role</th>
                                <th className="text-left px-4 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="px-4 py-3">{user.id}</td>

                                    <td className="px-4 py-3 font-semibold">
                                        {user.username}
                                    </td>

                                    <td className="px-4 py-3">
                                        {user.first_name} {user.last_name}
                                    </td>

                                    <td className="px-4 py-3">
                                        {user.email}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                user.role === "admin"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        {user.role === "admin" ? (
                                            <button
                                                onClick={() =>
                                                    handleRoleChange(
                                                        user.id,
                                                        "hiker"
                                                    )
                                                }
                                                className="rounded-lg bg-green-700 text-white px-4 py-2 hover:bg-green-800"
                                            >
                                                Make hiker
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleRoleChange(
                                                        user.id,
                                                        "admin"
                                                    )
                                                }
                                                className="rounded-lg bg-red-700 text-white px-4 py-2 hover:bg-red-800"
                                            >
                                                Make admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};