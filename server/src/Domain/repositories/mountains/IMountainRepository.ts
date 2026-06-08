import { Mountain } from "../../models/Mountain";

export interface IMountainRepository {
    getAll() : Promise<Mountain[]>;
    getById(id : number) : Promise<Mountain>;
    getByNaziv(name : string) : Promise<Mountain>;
    create(mountain : Mountain) : Promise<Mountain>;
    update(mountain : Mountain) : Promise<boolean>;
    delete(id: number): Promise<boolean>;    
}