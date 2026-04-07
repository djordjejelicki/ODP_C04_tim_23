import { Ascent } from "../../Domain/models/Ascent";
import { IAscentRepository } from "../../Domain/repositories/ascents/IAscentRepository";
import { IUserTrailRepository } from "../../Domain/repositories/userTrails/IUserTrailRepository";
import { IAscentService } from "../../Domain/services/acents/IAscentServuce";
import { UserTrailStatus } from "../../Domain/enums/UserTrailStatus";

export class AscentService implements IAscentService {
    
    public constructor(
        private ascentRepository: IAscentRepository,
        private userTrailRepository: IUserTrailRepository
    ){}

    async getMojiUsponi(user_id: number): Promise<Ascent[]> {
        return await this.ascentRepository.getByUser(user_id);
    }

    async getUsponById(id: number): Promise<Ascent> {
        return await this.ascentRepository.getById(id);
    }

    async dodajUspon(user_id: number, trail_id: number, datum: Date, trajanje_min: number, napomena: string | null, ocena: number): Promise<Ascent> {
        const userTrail = await this.userTrailRepository.getOne(user_id, trail_id);

        if (userTrail.user_id === 0){
            return new Ascent();
        }

        const noviUspon = new Ascent(
            0,
            user_id,
            trail_id,
            datum,
            trajanje_min,
            napomena,
            ocena
        );

        const kreiranUspon = await this.ascentRepository.add(noviUspon);

        if (kreiranUspon.id === 0){
            return new Ascent();
        }

        await this.userTrailRepository.updateStatus(
            user_id,
            trail_id,
            UserTrailStatus.COMPLETED
        );

        return kreiranUspon;
    }

    async izmeniUspon(user_id: number, id: number, datum: Date, trajanje_min: number, napomena: string | null, ocena: number): Promise<boolean> {
        
        const postojeciUspon = await this.ascentRepository.getById(id);

        if (postojeciUspon.id === 0 || postojeciUspon.user_id !== user_id){
            return false;
        }

        const izmenjeniUspon = new Ascent(
            id,
            user_id,
            postojeciUspon.trail_id,
            datum,
            trajanje_min,
            napomena,
            ocena
        );

        return await this.ascentRepository.update(izmenjeniUspon);
    }

    async obrisiUspon(user_id: number, id: number): Promise<boolean> {
        
        const postojeciUspon = await this.ascentRepository.getById(id);

        if (postojeciUspon.id === 0 || postojeciUspon.user_id !== user_id){
            return false;
        }

        return await this.ascentRepository.delete(id);
    }
}