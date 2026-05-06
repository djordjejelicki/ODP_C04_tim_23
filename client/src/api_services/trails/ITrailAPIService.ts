import type { Trail } from "../../types/trails/Trail";

export interface ITrailAPIService {
    getAll(): Promise<Trail[]>;
}