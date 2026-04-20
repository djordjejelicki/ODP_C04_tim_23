import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateHike = (
    trail_id: number,
    naziv: string,
    opis: string | null,
    datum_vreme: string,
    maksimalan_broj_ucesnika: number
): ValidationResault => {

    if (!Number.isInteger(trail_id) || trail_id <= 0){
        return { valid: false, message: "Ruta nije validna" };
    }

    if (typeof naziv !== "string" || naziv.trim().length < 2 || naziv.trim().length > 120){
        return { valid: false, message: "Naziv pohoda mora imati izmedju 2 i 120 karaktera" };
    }

    if (opis !== null && (typeof opis !== "string" || opis.length > 2000)) {
        return { valid: false, message: "Opis moze imati najvise 2000 karaktera" };
    }

    if (typeof datum_vreme !== "string" || datum_vreme.trim().length === 0){
        return { valid: false, message: "Datum i vreme pohoda su obavezni" };
    }

    const scheduledAt = new Date(datum_vreme);
    if (Number.isNaN(scheduledAt.getTime())){
        return { valid: false, message: "Datum i vreme pohoda nisu validni" };
    }

    if (scheduledAt <= new Date()){
        return {valid: false, message: "Datum pohoda mora biti u buducnosti" };
    }

    if (!Number.isInteger(maksimalan_broj_ucesnika) || maksimalan_broj_ucesnika < 2 || maksimalan_broj_ucesnika > 50) {
        return { valid: false, message: "Broj ucesnika mora biti izmedju 2 i 50" };
    }

    return { valid: true, message: "" }
}