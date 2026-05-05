import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateHike = (
    trail_id: number,
    name: string,
    description: string | null,
    scheduled_at: string,
    max_participants: number
): ValidationResault => {

    if (!Number.isInteger(trail_id) || trail_id <= 0){
        return { valid: false, message: "Ruta nije validna" };
    }

    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120){
        return { valid: false, message: "Naziv pohoda mora imati izmedju 2 i 120 karaktera" };
    }

    if (description !== null && (typeof description !== "string" || description.length > 2000)) {
        return { valid: false, message: "Opis moze imati najvise 2000 karaktera" };
    }

    if (typeof scheduled_at !== "string" || scheduled_at.trim().length === 0){
        return { valid: false, message: "Datum i vreme pohoda su obavezni" };
    }

    const scheduledAt = new Date(scheduled_at);
    if (Number.isNaN(scheduledAt.getTime())){
        return { valid: false, message: "Datum i vreme pohoda nisu validni" };
    }

    if (scheduledAt <= new Date()){
        return {valid: false, message: "Datum pohoda mora biti u buducnosti" };
    }

    if (!Number.isInteger(max_participants) || max_participants < 2 || max_participants > 50) {
        return { valid: false, message: "Broj ucesnika mora biti izmedju 2 i 50" };
    }

    return { valid: true, message: "" }
}