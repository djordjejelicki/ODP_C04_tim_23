import { TrailDifficulty } from "../../Domain/enums/TrailDifficulty";
import { ValidationResault } from "../../Domain/types/ValidationResult";


export const validateTrail = (
    mountain_id: number, 
    name: string,
    description: string | null,
    length_km: number,
    difficulty: string,
    est_duration_min: number,
    elevation_m: number,
    image_url: string,
    terrain_tag_ids: number[]
): ValidationResault => {
    if (!Number.isInteger(mountain_id) || mountain_id <= 0){
        return { valid: false, message: "Planina nije validna." };
    }

    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120){
        return { valid: false, message: "Naziv rute mora imati izmedju 2 i 120 karaktera." };
    }

    if (description !== null && (typeof description !== "string" || description.length > 2000)){
        return { valid: false, message: "Opis rute moze imati najvise 2000 karaktera"};
    }

    if (typeof length_km !== "number" || Number.isNaN(length_km) || length_km < 0.1){
        return { valid: false, message: "Duzina rute mora biti najmanje 0.1 km" };
    }

    if (!Object.values(TrailDifficulty).includes(difficulty as TrailDifficulty)){
        return { valid: false, message: "Izaberite validan nivo tezine" };
    }

    if (!Number.isInteger(est_duration_min) || est_duration_min < 10){
        return { valid: false, message: "Trajanje mora biti najmanje 10 minuta" };
    }

    if (!Number.isInteger(elevation_m) || elevation_m < 0 ){
        return { valid: false, message: "Visinska razlika mora biti 0 ili veca" };
    }

    if (typeof image_url !== "string" || image_url.trim().length === 0 || image_url.length > 255){
        return { valid: false, message: "Slika rute je obavezna" }
    }
    
    if (!Array.isArray(terrain_tag_ids) || terrain_tag_ids.length === 0) {
        return { valid: false, message: "Ruta mora imati bar jedan tip terena"}
    }
    return {valid: true, message: ""};
}