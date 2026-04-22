import { Trail } from "../../models/Trail";

export interface ITrailRepository {
    getAll(): Promise<Trail[]>;
    getById(id: number): Promise<Trail>;
    create(trail: Trail): Promise<Trail>;
    update(trail: Trail): Promise<boolean>;
}