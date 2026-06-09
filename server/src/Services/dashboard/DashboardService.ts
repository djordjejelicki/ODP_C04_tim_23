import { DashBoardStatsDto } from "../../Domain/DTOs/dashboard/DashBoardStatsDto";
import { UserTrailStatus } from "../../Domain/enums/UserTrailStatus";
import { IMountainRepository } from "../../Domain/repositories/mountains/IMountainRepository";
import { ITrailRepository } from "../../Domain/repositories/trails/ITrailRepository";
import { IUserTrailRepository } from "../../Domain/repositories/userTrails/IUserTrailRepository";
import { IDashboardService } from "../../Domain/services/dashboard/IDashboardService";

export class DashboardService implements IDashboardService {
    public constructor(
        private userTrailRepository: IUserTrailRepository,
        private trailRepository: ITrailRepository,
        private mountainRepository: IMountainRepository
    ) {}

    async getStats(user_id: number): Promise<DashBoardStatsDto> {
        const userTrails = await this.userTrailRepository.getByUser(user_id);

        const completedTrails = userTrails.filter(
            (item) => item.status === UserTrailStatus.COMPLETED
        );

        let totalDistance = 0;
        let totalElevation = 0;
        const mountainCounts = new Map<string, number>();

        for (const userTrail of completedTrails){
            const trail = await this.trailRepository.getById(userTrail.trail_id);

            if (trail.id === 0){
                continue;
            }

            totalDistance += trail.length_km;
            totalElevation += trail.elevation_m;

            const mountain = await this.mountainRepository.getById(trail.mountain_id);

            if (mountain.id !== 0){
                mountainCounts.set(mountain.name, (mountainCounts.get(mountain.name) ?? 0) + 1)
            }
        }

        let favoriteMountain = "";
        let maxCount = 0;

        for (const [mountainName, count] of mountainCounts){
            if (count > maxCount){
                favoriteMountain = mountainName;
                maxCount = count;
            }
        }

        return new DashBoardStatsDto(
            completedTrails.length,
            Number(totalDistance.toFixed(2)),
            totalElevation,
            favoriteMountain
        );
    }
}