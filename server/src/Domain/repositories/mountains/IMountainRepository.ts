import { Mountain } from "../../models/Mountain";

export interface IMountainRepository {
    getAll() : Promise<Mountain[]>;
    getById(id : number) : Promise<Mountain>;
    create(mountain : Mountain) : Promise<Mountain>;
}