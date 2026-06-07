import { useEffect, useState } from "react";
import type { TerrainTag } from "../../types/terrain_tags/TerrainTag";
import type { ITerrainTagAPIService } from "../../api_services/terrain_tags/ITerrainTagAPIService";
import { validateTerrainTag } from "../../validators/terrainTagValidator";

type AdminTerrainTagsPageProps = {
    terrainTagApi: ITerrainTagAPIService;
};

export default function AdminTerrainTagsPage({ terrainTagApi }: AdminTerrainTagsPageProps) {
    const [tags, setTags] = useState<TerrainTag[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const loadTags = async () => {
        const data = await terrainTagApi.getAll();
        setTags(data);
    };

    useEffect(() => {
        loadTags();
    }, [terrainTagApi]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const validation = validateTerrainTag(name, description || null);
        if (!validation.valid){
            setMessage(validation.message);
            return;
        } 

        const result = await terrainTagApi.create(
            name,
            description || null
        );

        if (!result.success){
            setMessage(result.message);
            return;
        }

        setName("");
        setDescription("");
        setMessage(result.message);
        await loadTags();
    };

    const handleDelete = async (id: number) => {
        setMessage("");

        const result = await terrainTagApi.remove(id);

        if (!result.success){
            setMessage(result.message);
            return;
        }

        setMessage(result.message);
        await loadTags();
    };

    return(
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Manage Terrain Tags
                </h1>

                <p className="text-gray-600 mt-2">
                    Create and remove terrain categories used by trails.
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
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button className="md:col-span-2 rounded-lg bg-orange-700 text-white py-2 font-semibold hover:bg-orange-800">
                        Create terrain tag
                    </button>
                </form>

                {message && (
                    <div className="mt-4 rounded-lg bg-orange-100 text-orange-800 px-4 py-3">
                        {message}
                    </div>
                )}

                <div className="mt-8 grid gap-4">
                    {tags.length === 0 ? (
                        <p className="text-gray-600">No terrain tags found.</p>
                    ) : (
                        tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {tag.name}
                                    </h2>

                                    <p className="text-gray-600">
                                        {tag.description ?? "No description"}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(tag.id)}
                                    className="rounded-lg bg-red-700 text-white px-4 py-2 hover:bg-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}