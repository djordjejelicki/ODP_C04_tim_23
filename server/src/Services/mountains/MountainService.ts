import { ServiceResult } from "../../Domain/common/ServiceResult";
import { MountainWithTrailCountDto } from "../../Domain/DTOs/mountain/MountainDto";
import { Mountain } from "../../Domain/models/Mountain";
import { IMountainRepository } from "../../Domain/repositories/mountains/IMountainRepository";
import { ITrailRepository } from "../../Domain/repositories/trails/ITrailRepository";
import { IMountainService } from "../../Domain/services/mountains/IMountainService";

export class MountainService implements IMountainService{
    public constructor(
        private mountainRepository : IMountainRepository,
        private trailRepository: ITrailRepository
    ){}

    async getSvePlanine(): Promise<MountainWithTrailCountDto[]> {
        const mountains =  await this.mountainRepository.getAll();
        const result: MountainWithTrailCountDto[] = [];

        for (const mountain of mountains) {
            const trailCount = await this.trailRepository.countByMountainId(mountain.id);

            result.push(
                new MountainWithTrailCountDto(
                    mountain.id,
                    mountain.name,
                    mountain.country,
                    mountain.region,
                    mountain.height,
                    mountain.description,
                    mountain.created_at,
                    trailCount
                )
            );
        }

        return result;
    }

    async getPlaninaById(id: number): Promise<Mountain> {
        return await this.mountainRepository.getById(id);
    }

    async createPlanina(
        name: string, 
        country: string, 
        region: string, 
        height: number, 
        description: string
    ): Promise<ServiceResult> {
        
        const postojecaPlanina = await this.mountainRepository.getByNaziv(name);
        if(postojecaPlanina.id !== 0){
            return ServiceResult.fail("Mountain with this name already exists");
        }
        
        const novaPlanina = new Mountain(
            0,
            name,
            country,
            region,
            height,
            description,
        );

        const createdMountain =  await this.mountainRepository.create(novaPlanina);

        if (createdMountain.id === 0){
            return ServiceResult.fail("Failed to create mountain");
        }

        return ServiceResult.ok("Mountain created successfully");

    }

    async updatePlanina(
        id: number, 
        name: string, 
        country: string, 
        region: string, 
        height: number, 
        description: string
    ): Promise<ServiceResult> {
        const postojecaPlanina = await this.mountainRepository.getById(id);

        if (postojecaPlanina.id === 0){
            return ServiceResult.fail("Mountain not found");
        }

        const planinaSaIstimNazivom = await this.mountainRepository.getByNaziv(name);

        if (planinaSaIstimNazivom.id !== 0 && planinaSaIstimNazivom.id !== id){
            return ServiceResult.fail("Mountain with this name already exists");
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
            return ServiceResult.fail("Failed to update mountain");
        }

        return ServiceResult.ok("Mountain updated successfully");
    }

    async deletePlanina(id: number): Promise<ServiceResult> {
        const postojecaPlanina = await this.mountainRepository.getById(id);

        if (postojecaPlanina.id === 0){
            return ServiceResult.fail("Mountain not found");
        }

        const koristiSe = await this.trailRepository.existsByMountainId(id);

        if (koristiSe){
            return ServiceResult.fail("Mountain cannot be deleted because it is used by one or more trails");
        }

        const deleted = await this.mountainRepository.delete(id);

        if (!deleted){
            return ServiceResult.fail("Failed to delete mountain");
        }

        return ServiceResult.ok("Mountain deleted successfully");
    }
}