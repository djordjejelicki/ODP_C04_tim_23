import { TrailDifficulty } from "../../Domain/enums/TrailDifficulty";
import { ValidationResault } from "../../Domain/types/ValidationResult";


export const validateTrail = (
    mountain_id: number, 
    naziv: string,
    opis: string | null,
    duzina_km: number,
    tezina: string,
    trajanje_min: number,
    visinski_uspon_m: number,
    slika_url: string
): ValidationResault => {
    if (!Number.isInteger(mountain_id) || mountain_id <= 0){
        return { valid: false, message: "Planina nije validna." };
    }

    if (typeof naziv !== "string" || naziv.trim().length < 2 || naziv.trim().length > 120){
        return { valid: false, message: "Naziv rute mora imati izmedju 2 i 120 karaktera." };
    }

    if (opis !== null && (typeof opis !== "string" || opis.length > 2000)){
        return { valid: false, message: "Opis rute moze imati najvise 2000 karaktera"};
    }

    if (typeof duzina_km !== "number" || Number.isNaN(duzina_km) || duzina_km < 0.1){
        return { valid: false, message: "Duzina rute mora biti najmanje 0.1 km" };
    }

    if (!Object.values(TrailDifficulty).includes(tezina as TrailDifficulty)){
        return { valid: false, message: "Izaberite validan nivo tezine" };
    }

    if (!Number.isInteger(trajanje_min) || trajanje_min < 10){
        return { valid: false, message: "Trajanje mora biti najmanje 10 minuta" };
    }

    if (!Number.isInteger(visinski_uspon_m) || visinski_uspon_m < 0 ){
        return { valid: false, message: "Visinska razlika mora biti 0 ili veca" };
    }

    if (typeof slika_url !== "string" || slika_url.trim().length === 0 || slika_url.length > 255){
        return { valid: false, message: "Slika rute je obavezna" }
    }

    return {valid: true, message: ""};
}