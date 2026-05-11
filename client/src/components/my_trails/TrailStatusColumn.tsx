import type { UserTrail } from "../../types/my_trails/UserTrail";

type TrailStatusColumnProps = {
    title: string;
    items: UserTrail[];
};

export function TrailStatusColumn({title, items}: TrailStatusColumnProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

            {items.length === 0 ? (
                <p className="text-gray-500 mt-4">
                No trails in this section.
                </p>
            ) : (
                <div className="space-y-3 mt-4">
                {items.map((item) => (
                    <div
                    key={`${item.user_id}-${item.trail_id}`}
                    className="border rounded-xl p-4 flex items-center justify-between"
                    >
                    <div>
                        <p className="font-semibold">
                        Trail ID: {item.trail_id}
                        </p>

                        <p className="text-sm text-gray-500">
                        Added at: {item.added_at ?? "N/A"}
                        </p>
                    </div>

                    <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-sm">
                        {item.status}
                    </span>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}