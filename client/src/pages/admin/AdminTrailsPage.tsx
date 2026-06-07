import { useEffect, useState } from "react";
import type { Trail } from "../../types/trails/Trail";
import type { TrailDifficulty } from "../../types/trails/TrailDifficulty";
import type { Mountain } from "../../types/mountains/Mountain";
import type { TerrainTag } from "../../types/terrain_tags/TerrainTag";
import type { ITrailAPIService } from "../../api_services/trails/ITrailAPIService";
import type { IMountainAPIService } from "../../api_services/mountains/IMountainAPIService";
import type { ITerrainTagAPIService } from "../../api_services/terrain_tags/ITerrainTagAPIService";
import { getImageUrl } from "../../helpers/get_image_url";
import { validateTrail } from "../../validators/trailValidator";
import { TRAIL_DIFFICULTIES } from "../../types/trails/TrailDifficulty";

type AdminTrailsPageProps = {
    trailApi: ITrailAPIService;
    mountainApi: IMountainAPIService;
    terrainTagApi: ITerrainTagAPIService;
};

export default function AdminTrailsPage({ trailApi, mountainApi, terrainTagApi } : AdminTrailsPageProps){
    const [trails, setTrails] = useState<Trail[]>([]);
    const [mountains, setMountains] = useState<Mountain[]>([]);
    const [terrainTags, setTerraingTags] = useState<TerrainTag[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [mountainId, setMountainId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [lengthKm, setLengthKm] = useState("");
    const [difficulty, setDifficulty] = useState<TrailDifficulty>("easy");
    const [estDurationMin, setEstDurationMin] = useState("");
    const [elevationM, setElevationM] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [message, setMessage] = useState("");

    const loadData = async () => {
        const trailsData = await trailApi.getAll();
        const mountainsData = await mountainApi.getAll();
        const tagsData = await terrainTagApi.getAll();

        setTrails(trailsData);
        setMountains(mountainsData);
        setTerraingTags(tagsData);
    };

    useEffect(() => {
        loadData();
    }, [trailApi, mountainApi, terrainTagApi]);

    const resetForm = () => {
        setEditingId(null);
        setMountainId("");
        setName("");
        setDescription("");
        setLengthKm("");
        setDifficulty("easy");
        setEstDurationMin("");
        setElevationM("");
        setImageUrl("");
        setImage(null);
        setSelectedTagIds([]);
    };

    const toggleTag = (tagId: number) => {
        setSelectedTagIds((current) => 
            current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]
        );
    };

    const getMountainName = (id: number) => {
        const mountain = mountains.find((item) => item.id === id);
        return mountain?.name ?? `Mountain ID: ${id}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const validation = validateTrail(
            Number(mountainId), 
            name, 
            description || null,
            Number(lengthKm),
            difficulty,
            Number(estDurationMin),
            Number(elevationM),
            imageUrl,
            image,
            selectedTagIds,
            editingId !== null
        );

        if (!validation.valid) {
            setMessage(validation.message);
            return;
        }

        const result = 
            editingId === null
            ? await trailApi.create(
                Number(mountainId),
                name,
                description || null,
                Number(lengthKm),
                difficulty,
                Number(estDurationMin),
                Number(elevationM),
                image,
                selectedTagIds
            )
            : await trailApi.update(
                editingId,
                Number(mountainId),
                name,
                description || null,
                Number(lengthKm),
                difficulty,
                Number(estDurationMin),
                Number(elevationM),
                image,
                imageUrl,
                selectedTagIds
            );

        if (!result.success){
            setMessage(result.message);
            return;
        }

        setMessage(result.message);
        resetForm();
        await loadData();
    };

    const handleEdit = async (trail: Trail) => {
        const details = await trailApi.getById(trail.id);

        if (!details){
            setMessage("Failed to load trail details.");
            return;
        }

        setEditingId(trail.id);
        setMountainId(String(details.mountain_id));
        setName(details.name);
        setDescription(details.description ?? "");
        setLengthKm(String(details.length_km));
        setDifficulty(details.difficulty);
        setEstDurationMin(String(details.est_duration_min));
        setElevationM(String(details.elevation_m));
        setImageUrl(details.image_url);
        setImage(null);
        setSelectedTagIds(details.terrain_tags.map((tag) => tag.id));
        setMessage("");
    };

    const handleDelete = async (id: number) => {
        setMessage("");

        const result = await trailApi.remove(id);

        if (!result.success) {
            setMessage(result.message);
            return;
        }

        setMessage(result.message);
        await loadData();
    };

    const previewImageUrl = image ? URL.createObjectURL(image) : imageUrl ? getImageUrl(imageUrl) : "";

    return(
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Manage Trails
                </h1>

                <p className="text-gray-600 mt-2">
                    Create, update and delete trail catalog items.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 bg-white rounded-2xl shadow-md p-6 grid gap-4 md:grid-cols-2"
                >
                    <select
                        className="rounded-lg border px-3 py-2"
                        value={mountainId}
                        onChange={(e) => setMountainId(e.target.value)}
                    >
                        <option value="">Choose mountain</option>
                        {mountains.map((mountain) => (
                            <option key={mountain.id} value={mountain.id}>
                                {mountain.name}
                            </option>
                        ))}
                    </select>

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Trail name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Length km"
                        value={lengthKm}
                        onChange={(e) => setLengthKm(e.target.value)}
                    />

                    <select
                        className="rounded-lg border px-3 py-2"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as TrailDifficulty)}
                    >
                        {TRAIL_DIFFICULTIES.map((difficulty) => (
                            <option key={difficulty} value={difficulty}>
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </option>
                        ))}
                    </select>

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Estimated duration min"
                        value={estDurationMin}
                        onChange={(e) => setEstDurationMin(e.target.value)}
                    />

                    <input
                        className="rounded-lg border px-3 py-2"
                        placeholder="Elevation m"
                        value={elevationM}
                        onChange={(e) => setElevationM(e.target.value)}
                    />

                    <label className="md:col-span-2 cursor-pointer rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 px-4 py-6 text-center hover:bg-orange-100 transition">
                        <span className="block font-semibold text-orange-800">
                            {image ? image.name : "Click to choose trail image"}
                        </span>

                        <span className="block text-sm text-orange-700 mt-1">
                            JPG, PNG or WEBP up to 5MB
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                            className="hidden"
                        />

                        {previewImageUrl && (
                            <img
                                src={previewImageUrl}
                                alt={name}
                                className="mt-4 h-48 w-full object-cover rounded-xl"
                            />
                        )}
                    </label>
                    <textarea
                        className="rounded-lg border px-3 py-2 md:col-span-2"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="md:col-span-2">
                        <p className="font-semibold text-gray-900 mb-2">
                            Terrain tags
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {terrainTags.map((tag) => (
                                <label
                                    key={tag.id}
                                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTagIds.includes(tag.id)}
                                        onChange={() => toggleTag(tag.id)}
                                    />
                                    {tag.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <button className="rounded-lg bg-orange-700 text-white px-5 py-2 font-semibold hover:bg-orange-800">
                            {editingId === null ? "Create trail" : "Update trail"}
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
                    {trails.length === 0 ? (
                        <p className="text-gray-600">No trails found.</p>
                    ) : (
                        trails.map((trail) => (
                            <div
                                key={trail.id}
                                className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div>
                                    {trail.image_url && (
                                        <img
                                            src={getImageUrl(trail.image_url)}
                                            alt={trail.name}
                                            className="w-full md:w-64 h-40 object-cover rounded-xl mb-4"
                                        />
                                    )}
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {trail.name}
                                    </h2>

                                    <p className="text-gray-600">
                                        {getMountainName(trail.mountain_id)} · {trail.difficulty}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {trail.length_km.toFixed(2)} km · {trail.elevation_m} m elevation · {trail.est_duration_min} min
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEdit(trail)}
                                        className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(trail.id)}
                                        className="rounded-lg bg-red-700 text-white px-4 py-2 hover:bg-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
};