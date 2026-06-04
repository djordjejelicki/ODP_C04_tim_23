import { serialize, Serializer } from "node:v8";
import { ServiceResult } from "../../Domain/common/ServiceResult";
import { Mountain } from "../../Domain/models/Mountain";
import { IMountainRepository } from "../../Domain/repositories/mountains/IMountainRepository";
import { IMountainService } from "../../Domain/services/mountains/IMountainService";

export class MountainService implements IMountainService{
    public constructor(private mountainRepository : IMountainRepository){}

    async getSvePlanine(): Promise<Mountain[]> {
        return await this.mountainRepository.getAll();
    }

    async getPlaninaById(id: number): Promise<Mountain> {
        return await this.mountainRepository.getById(id);
    }

    async createPlanina(
        name: string, 
        country: string, 
        region: string | null, 
        height: number, 
        description: string | null
    ): Promise<ServiceResult<Mountain>> {
        
        const postojecaPlanina = await this.mountainRepository.getByNaziv(name);
        if(postojecaPlanina.id !== 0){
            return ServiceResult.fail<Mountain>("Mountain with this name already exists");
        }
        
        const novaPlanina = new Mountain(
            0,
            name,
            country,
            region,
            height,
            description,
            null
        );

        const createdMountain =  await this.mountainRepository.create(novaPlanina);

        if (createdMountain.id === 0){
            return ServiceResult.fail<Mountain>("Failed to create mountain");
        }

        return ServiceResult.ok<Mountain>("Mountain created successfully", createdMountain);

    }

    async updatePlanina(
        id: number, 
        name: string, 
        country: string, 
        region: string | null, 
        height: number, 
        description: string | null
    ): Promise<ServiceResult<null>> {
        const postojecaPlanina = await this.mountainRepository.getById(id);

        if (postojecaPlanina.id === 0){
            return ServiceResult.fail<null>("Mountain not found");
        }

        const planinaSaIstimNazivom = await this.mountainRepository.getByNaziv(name);

        if (planinaSaIstimNazivom.id !== 0 && planinaSaIstimNazivom.id !== id){
            return ServiceResult.fail<null>("Mountain with this name already exists");
        }

        const izmenjenaPlanina = new Mountain(
            id,
            name,
            country,
            region,
            height,
            description,
            postojecaPlanina.created_at
        );

        const updated =  await this.mountainRepository.update(izmenjenaPlanina);

        if (!updated){
            return ServiceResult.fail<null>("Failed to update mountain");
        }

        return ServiceResult.ok<null>("Mountain updated successfully");
    }
}