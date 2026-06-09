import { Mountain } from "../../models/Mountain";
import { MountainWithTrailCountDto } from "../../DTOs/mountain/MountainDto";
import { ServiceResult } from "../../common/ServiceResult";


export interface IMountainService {
    getSvePlanine(): Promise<MountainWithTrailCountDto[]>;
    getPlaninaById(id : number) : Promise<Mountain>;
    createPlanina(
        name: string,
        country: string,
        region: string,
        height: number,
        description: string
    ) : Promise<ServiceResult>;
    updatePlanina(
        id: number,
        name: string,
        country: string,
        region: string,
        height: number,
        description: string
    ): Promise<ServiceResult>;
    deletePlanina(id: number): Promise<ServiceResult>;
}