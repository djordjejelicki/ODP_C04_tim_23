import { useEffect, useState } from "react";
import type { Trail } from "../../types/trails/Trail";
import type { ITrailAPIService } from "../../api_services/trails/ITrailAPIService";
import { TrailCard } from "../../components/trails/TrailCard";
import type { IMountainAPIService } from "../../api_services/mountains/IMountainAPIService";
import type { ITerrainTagAPIService } from "../../api_services/terrain_tags/ITerrainTagAPIService";
import type { Mountain } from "../../types/mountains/Mountain";
import type { TerrainTag } from "../../types/trails/TrailDetails";
import type { TrailDifficulty } from "../../types/trails/Trail";

type TrailsPageProps = {
    trailApi: ITrailAPIService;
    mountainApi: IMountainAPIService;
    terrainTagApi: ITerrainTagAPIService;
};

type SortOption = 
    | "name"
    | "rating_desc"
    | "rating_asc"
    | "length_asc"
    | "length_desc"
    | "elevation_asc"
    | "elevation_desc";

export default function TrailsPage({ trailApi, mountainApi, terrainTagApi }: TrailsPageProps) {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("name");

    const [mountains, setMountains] = useState<Mountain[]>([]);
    const [terrainTags, setTerrainTags] = useState<TerrainTag[]>([]);

    const [difficultyFilter, setDifficultyFilter] = useState("");
    const [mountainFilter, setMountainFilter] = useState("");
    const [terrainFilter, setTerrainFilter] = useState("");
    const [maxLengthFilter, setMaxLengthFilter] = useState("");

    useEffect(() => {
        const loadTrails = async () => {
            const trailsData = await trailApi.getAll();
            const mountainsData = await mountainApi.getAll();
            const terrainTagsData = await terrainTagApi.getAll();

            setTrails(trailsData);
            setMountains(mountainsData);
            setTerrainTags(terrainTagsData);
            setIsLoading(false);
        };

        loadTrails();
    }, [trailApi])

    const filteredTrails = trails.filter((trail) => {
        const matchesDifficulty = 
            !difficultyFilter || trail.difficulty === difficultyFilter;
        
        const matchesMountain = 
            !mountainFilter || trail.mountain_id === Number(mountainFilter);
        
        const matchesTerrain = 
            !terrainFilter || trail.terrain_tags.some((tag) => tag.id === Number(terrainFilter));
        
        const matchesLenght = 
            !maxLengthFilter || trail.length_km <= Number(maxLengthFilter);

        return(
            matchesDifficulty &&
            matchesMountain &&
            matchesTerrain && 
            matchesLenght
        );
    });

    const sortedTrails = [...filteredTrails].sort((a,b) => {
        if (sortBy === "rating_desc"){
            return (b.average_rating ?? 0) - (a.average_rating ?? 0);
        }
        if (sortBy === "rating_asc"){
            return (a.average_rating ?? 0) - (b.average_rating ?? 0);
        }
        if (sortBy === "length_asc"){
            return a.length_km - b.length_km;
        }
        if (sortBy === "length_desc"){
            return b.length_km - a.length_km;
        }
        if (sortBy === "elevation_asc"){
            return a.elevation_m - b.elevation_m;
        }
        if (sortBy === "elevation_desc"){
            return b.elevation_m - a.elevation_m;
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <main className="min-h-screen bg-slate-100">
            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Trail Catalog
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Explore available hiking trails.
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-5">
                        <select
                            className="rounded-lg border px-3 py-2"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                        >
                            <option value="name">Sort by name</option>
                            <option value="rating_desc">Rating high to low</option>
                            <option value="rating_asc">Rating low to high</option>
                            <option value="length_asc">Length ascending</option>
                            <option value="length_desc">Length descending</option>
                            <option value="elevation_asc">Elevation ascending</option>
                            <option value="elevation_desc">Elevation descending</option>
                        </select>

                        <select
                            className="rounded-lg border px-3 py-2"
                            value={difficultyFilter}
                            onChange={(e) =>
                                setDifficultyFilter(e.target.value as TrailDifficulty | "")
                            }
                        >
                            <option value="">All difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="moderate">Moderate</option>
                            <option value="hard">Hard</option>
                            <option value="expert">Expert</option>
                        </select>

                        <select
                            className="rounded-lg border px-3 py-2"
                            value={mountainFilter}
                            onChange={(e) => setMountainFilter(e.target.value)}
                        >
                            <option value="">All mountains</option>
                            {mountains.map((mountain) => (
                                <option key={mountain.id} value={mountain.id}>
                                    {mountain.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="rounded-lg border px-3 py-2"
                            value={terrainFilter}
                            onChange={(e) => setTerrainFilter(e.target.value)}
                        >
                            <option value="">All terrain tags</option>
                            {terrainTags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>

                        <input
                            className="rounded-lg border px-3 py-2"
                            placeholder="Max length km"
                            value={maxLengthFilter}
                            onChange={(e) => setMaxLengthFilter(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setDifficultyFilter("");
                            setMountainFilter("");
                            setTerrainFilter("");
                            setMaxLengthFilter("");
                            setSortBy("name");
                        }}
                        className="mt-4 rounded-lg bg-gray-200 text-gray-800 px-4 py-2 font-semibold hover:bg-gray-300"
                    >
                        Clear filters
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-gray-600">Loading trails...</p>
                ) : trails.length === 0 ? (
                    <p className="text-gray-600">No trails found.</p>
                ) : sortedTrails.length === 0 ? (
                    <p className="text-gray-600">No trails match your filters.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedTrails.map((trail) => (
                            <TrailCard key={trail.id} trail={trail} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}