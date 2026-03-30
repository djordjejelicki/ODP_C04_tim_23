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

    async createPlanina(naziv: string, drzava: string, region: string | null, visina: number, opis: string | null): Promise<Mountain> {
        const novaPlanina = new Mountain(
            0,
            naziv,
            drzava,
            region,
            visina,
            opis,
            null
        );

        return await this.mountainRepository.create(novaPlanina);
    }
}