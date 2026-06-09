import { Ascent } from "../../models/Ascent";

export interface IAscentRepository {
    getByUser(user_id: number): Promise<Ascent[]>;
    getById(id: number): Promise<Ascent>;
    add(ascent: Ascent): Promise<Ascent>;
    update(ascent: Ascent): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    existsByTrail(trail_id: number): Promise<boolean>;
    existsByUserAndTrail(user_id: number, trail_id: number): Promise<boolean>;
    getAverageRatingByTrail(trail_id: number): Promise<number>;
}