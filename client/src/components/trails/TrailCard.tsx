import { Link } from "react-router-dom";
import type { Trail } from "../../types/trails/Trail";
import { getImageUrl } from "../../helpers/get_image_url";

type TrailCardProps = {
    trail: Trail;
};

export function TrailCard({ trail }: TrailCardProps) {
    return(
        <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
            <img
                src={getImageUrl(trail.image_url)}
                alt={trail.name}
                className="w-full h-44 object-cover"
            />

            <div className="p-5 space-y-3">
                <div>
                <h2 className="text-xl font-bold text-gray-900">{trail.name}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {trail.description}
                </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <span>Length: {trail.length_km.toFixed(2)} km</span>
                <span>Elevation: {trail.elevation_m} m</span>
                <span>Duration: {trail.est_duration_min} min</span>
                <span className="capitalize">Difficulty: {trail.difficulty}</span>
                </div>

                <Link
                to={`/trails/${trail.id}`}
                className="inline-block w-full text-center rounded-lg bg-orange-700 text-white py-2 font-semibold hover:bg-orange-800"
                >
                View details
                </Link>
            </div>
        </article>
    );
}