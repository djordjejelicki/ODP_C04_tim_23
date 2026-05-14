import { useEffect, useState } from "react";
import type { Mountain } from "../../types/mountains/Mountain";
import type { IMountainAPIService } from "../../api_services/mountains/IMountainAPIService";

type AdminMountainsPageProps = {
    mountainApi: IMountainAPIService;
};  

export default function AdminMountainsPage({ mountainApi }: AdminMountainsPageProps){
    const [mountains, setMountains] = useState<Mountain[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [height, setHeight] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const loadMountains = async () => {
        const data = await mountainApi.getAll();
        setMountains(data);
    };

    useEffect(() => {
        loadMountains();
    }, [mountainApi]);

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setCountry("");
        setRegion("");
        setHeight("");
        setDescription("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const success = 
            editingId === null 
                ? await mountainApi.create(
                    name,
                    country,
                    region || null,
                    Number(height),
                    description || null
                )
                : await mountainApi.update(
                    editingId,
                    name,
                    country,
                    region || null,
                    Number(height),
                    description || null
                );

        if (!success){
            setMessage("Failed to save mountain.");
            return;
        }

        setMessage(editingId === null ? "Mountain created." : "Mountain updated.");
        resetForm();
        await loadMountains();
    }

    const handleEdit = (mountain: Mountain) => {
        setEditingId(mountain.id);
        setName(mountain.name);
        setCountry(mountain.country);
        setRegion(mountain.region ?? "");
        setHeight(String(mountain.height));
        setDescription(mountain.description ?? "");
        setMessage("");
    };

    return(
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Manage Mountains
                </h1>

                <p className="text-gray-600 mt-2">
                    Create and update mountains used by trails.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 bg-white rounded-2xl shadow-md p-6 grid gap-4 md:grid-cols-2"
                >
                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                    />

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />

                    <textarea
                        className="rounded-lg border px-3 py-2 md:col-span-2"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="md:col-span-2 flex gap-3">
                        <button className="rounded-lg bg-orange-700 text-white px-5 py-2 font-semibold hover:bg-orange-800">
                            {editingId === null ? "Create mountain" : "Update mountain"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg bg-gray-200 text-gray-800 px-5 py-2 font-semibold hover:bg-gray-300"
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>
                </form>

                {message && (
                    <div className="mt-4 rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                        {message}
                    </div>
                )}

                <div className="mt-8 grid gap-4">
                    {mountains.length === 0 ? (
                        <p className="text-gray-600">No mountains found.</p>
                    ) : (
                        mountains.map((mountain) => (
                            <div
                                key={mountain.id}
                                className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {mountain.name}
                                    </h2>

                                    <p className="text-gray-600">
                                        {mountain.country}
                                        {mountain.region ? ` · ${mountain.region}` : ""}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Height: {mountain.height} m
                                    </p>

                                    {mountain.description && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {mountain.description}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleEdit(mountain)}
                                    className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
                                >
                                    Edit
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}