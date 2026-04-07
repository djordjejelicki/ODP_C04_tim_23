import { isNumberObject } from "node:util/types";
import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateAscent = (
    trail_id: number,
    datum: string,
    trajanje_min: number,
    napomena: string | null,
    ocena: number
): ValidationResault => {
    
    if (!Number.isInteger(trail_id) || trail_id <= 0){
        return { valid: false, message: "Ruta nije validna" };
    }

    if (typeof datum !== "string" || datum.trim().length === 0){
        return { valid: false, message: "Datum uspona je obavezan" };
    }

    const ascentDate = new Date(datum);
    if (Number.isNaN(ascentDate.getTime())){
        return { valid: false, message: "Datum uspona nije validan" };
    }

    const today = new Date();
    today.setHours(23,59,59,999);
    if(ascentDate > today){
        return {valid: false, message: "Datum uspona ne moze biti u buducnosti" };
    }

    if (!Number.isInteger(trajanje_min) || trajanje_min < 1){
        return { valid: false, message: "Trajanje mora biti pozitivan ceo broj" };
    }

    if (napomena !== null && (typeof napomena !== "string" || napomena.length > 2000)){
        return { valid: false, message: "Napomena moze imati najvise 2000 karaktera" };
    }

    if (!Number.isInteger(ocena) || ocena < 1 || ocena > 10){
        return { valid: false, message: "Ocena mora biti izmedju 1 i 10" };
    }

    return { valid: true, message: "" };
}