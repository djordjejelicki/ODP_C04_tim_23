import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateAscent = (
    trail_id: number,
    ascent_date: string,
    duration_min: number,
    note: string | null,
    rating: number
): ValidationResault => {
    
    if (!Number.isInteger(trail_id) || trail_id <= 0){
        return { valid: false, message: "Ruta nije validna" };
    }

    if (typeof ascent_date !== "string" || ascent_date.trim().length === 0){
        return { valid: false, message: "Datum uspona je obavezan" };
    }

    const ascentDate = new Date(ascent_date);
    if (Number.isNaN(ascentDate.getTime())){
        return { valid: false, message: "Datum uspona nije validan" };
    }

    const today = new Date();
    today.setHours(23,59,59,999);
    if(ascentDate > today){
        return {valid: false, message: "Datum uspona ne moze biti u buducnosti" };
    }

    if (!Number.isInteger(duration_min) || duration_min < 1){
        return { valid: false, message: "Trajanje mora biti pozitivan ceo broj" };
    }

    if (note !== null && (typeof note !== "string" || note.length > 2000)){
        return { valid: false, message: "Napomena moze imati najvise 2000 karaktera" };
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 10){
        return { valid: false, message: "Ocena mora biti izmedju 1 i 10" };
    }

    return { valid: true, message: "" };
}