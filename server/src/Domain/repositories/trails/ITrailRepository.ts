import { Trail } from "../../models/Trail";

export interface ITrailRepository {
    getAll(): Promise<Trail[]>;
    getById(id: number): Promise<Trail>;
    create(trail: Trail): Promise<Trail>;
    update(trail: Trail): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    existsByMountainId(mountain_id: number): Promise<boolean>;
    countByMountainId(mountain_id: number): Promise<number>;
}