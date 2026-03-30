import { Mountain } from "../../models/Mountain";

export interface IMountainService {
    getSvePlanine(): Promise<Mountain[]>;
    getPlaninaById(id : number) : Promise<Mountain>;
    createPlanina(
        naziv: string,
        drzava: string,
        region: string | null,
        visina: number,
        opis: string | null
    ) : Promise<Mountain>;
}