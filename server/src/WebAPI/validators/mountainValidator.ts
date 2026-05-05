import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateMountain = (
    name: string,
    country: string,
    region: string | null,
    height: number,
    description: string | null
) : ValidationResault => {
    
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100){
        return { valid: false, message: "Naziv planine mora imati izmedju 2 i 100 karaktera" };
    }

    if (typeof country !== "string" || country.trim().length < 2 || country.trim().length > 100){
        return { valid: false, message: "Drzava nije validna" };
    }
   
    if (region !== null && (typeof region !== "string" || region.trim().length < 2 || region.trim().length > 100)){
        return { valid: false, message: "Region nije validan" }
    }

    if (!Number.isInteger(height) || height <= 0){
        return { valid: false, message: "Visina mora biti pozitivan ceo broj" };
    }

    if (description !== null && (typeof description !== "string" || description.length > 2000)){
        return { valid: false, message: "Opis moze imati najvise 2000 karaktera" }
    }

    return { valid: true, message: "" }
};