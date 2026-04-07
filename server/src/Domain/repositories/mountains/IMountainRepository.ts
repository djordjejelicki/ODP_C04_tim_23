import { Mountain } from "../../models/Mountain";

export interface IMountainRepository {
    getAll() : Promise<Mountain[]>;
    getById(id : number) : Promise<Mountain>;
    getByNaziv(naziv : string) : Promise<Mountain>;
    create(mountain : Mountain) : Promise<Mountain>;
}