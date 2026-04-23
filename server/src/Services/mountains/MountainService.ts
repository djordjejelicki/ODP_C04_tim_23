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
        
        const postojecaPlanina = await this.mountainRepository.getByNaziv(naziv);
        if(postojecaPlanina.id !== 0){
            return new Mountain();
        }
        
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

    async updatePlanina(id: number, naziv: string, drzava: string, region: string | null, visina: number, opis: string | null): Promise<boolean> {
        const postojecaPlanina = await this.mountainRepository.getById(id);

        if (postojecaPlanina.id === 0){
            return false;
        }

        const planinaSaIstimNazivom = await this.mountainRepository.getByNaziv(naziv);

        if (planinaSaIstimNazivom.id !== 0 && planinaSaIstimNazivom.id !== id){
            return false;
        }

        const izmenjenaPlanina = new Mountain(
            id,
            naziv,
            drzava,
            region,
            visina,
            opis,
            postojecaPlanina.created_at
        );

        return await this.mountainRepository.update(izmenjenaPlanina);
    }
}