import type { Trail } from "../../types/trails/Trail";
import type { TrailDetails } from "../../types/trails/TrailDetails";

export interface ITrailAPIService {
    getAll(): Promise<Trail[]>;
    getById(id: number): Promise<TrailDetails | null>;
}