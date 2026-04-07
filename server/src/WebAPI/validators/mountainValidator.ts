import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateMountain = (
    naziv: string,
    drzava: string,
    region: string | null,
    visina: number,
    opis: string | null
) : ValidationResault => {
    
    if (typeof naziv !== "string" || naziv.trim().length < 2 || naziv.trim().length > 100){
        return { valid: false, message: "Naziv planine mora imati izmedju 2 i 100 karaktera" };
    }

    if (typeof drzava !== "string" || drzava.trim().length < 2 || drzava.trim().length > 100){
        return { valid: false, message: "Drzava nije validna" };
    }
   
    if (region !== null && (typeof region !== "string" || region.trim().length < 2 || region.trim().length > 100)){
        return { valid: false, message: "Region nije validan" }
    }

    if (!Number.isInteger(visina) || visina <= 0){
        return { valid: false, message: "Visina mora biti pozitivan ceo broj" };
    }

    if (opis !== null && (typeof opis !== "string" || opis.length > 2000)){
        return { valid: false, message: "Opis moze imati najvise 2000 karaktera" }
    }

    return { valid: true, message: "" }
};