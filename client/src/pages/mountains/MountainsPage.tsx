import { useEffect, useState } from "react";
import type { Mountain } from "../../types/mountains/Mountain";
import type { IMountainAPIService } from "../../api_services/mountains/IMountainAPIService";

type MountainsPageProps = {
    mountainApi: IMountainAPIService;
};

export default function MountainsPage({mountainApi}: MountainsPageProps) {
    const [mountains, setMountains] = useState<Mountain[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMountains = async () => {
            const data = await mountainApi.getAll();
            setMountains(data);
            setIsLoading(false);
        };

        loadMountains();
    }, [mountainApi]);

    return (
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Mountains & Regions
                </h1>

                <p className="text-gray-600 mt-2">
                    Explore mountains available in the TrailSync catalog.
                </p>

                {isLoading ? (
                    <p className="mt-8 text-gray-600">
                        Loading mountains...
                    </p>
                ) : mountains.length === 0 ? (
                    <p className="mt-8 text-gray-600">
                        No mountains found.
                    </p>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mountains.map((mountain) => (
                            <article
                                key={mountain.id}
                                className="bg-white rounded-2xl shadow-md p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {mountain.name}
                                </h2>

                                <p className="text-orange-700 font-semibold mt-1">
                                    {mountain.country}
                                </p>

                                {mountain.region && (
                                    <p className="text-gray-600">
                                        Region: {mountain.region}
                                    </p>
                                )}

                                <p className="mt-3 text-gray-700">
                                    Height: {mountain.height} m
                                </p>

                                <p className="text-orange-700 font-semibold">
                                    Trails: {mountain.trail_count}
                                </p>

                                {mountain.description && (
                                    <p className="mt-4 text-gray-600">
                                        {mountain.description}
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}