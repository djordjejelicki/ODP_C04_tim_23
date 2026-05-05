import { Mountain } from "../../models/Mountain";

export interface IMountainService {
    getSvePlanine(): Promise<Mountain[]>;
    getPlaninaById(id : number) : Promise<Mountain>;
    createPlanina(
        name: string,
        country: string,
        region: string | null,
        height: number,
        description: string | null
    ) : Promise<Mountain>;
    updatePlanina(
        id: number,
        name: string,
        country: string,
        region: string | null,
        height: number,
        description: string | null
    ): Promise<boolean>;
}