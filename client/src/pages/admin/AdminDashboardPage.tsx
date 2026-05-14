import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
    const cards = [
        {
            title: "Users",
            description: "Manage users and roles.",
            to: "/admin/users",
        },
        {
            title: "Audit logs",
            description: "View system activity logs.",
            to: "/admin/audit-logs",
        },
        {
            title: "Trails",
            description: "Create, edit and delete trails.",
            to: "/admin/trails",
        },
        {
            title: "Mountains",
            description: "Manage mountains and regions.",
            to: "/admin/mountains",
        },
        {
            title: "Terrain tags",
            description: "Manage terrain tag catalog.",
            to: "/admin/terrain-tags",
        },
    ];

    return (
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>

                <p className="text-gray-600 mt-2">
                    Manage TrailSync catalog, users and system logs.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {cards.map((card) => (
                        <Link
                            key={card.to}
                            to={card.to}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                        >
                            <h2 className="text-2xl font-bold text-gray-900">
                                {card.title}
                            </h2>

                            <p className="text-gray-600 mt-2">
                                {card.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
};