import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateMountain = (
    name: string,
    country: string,
    region: string,
    height: number,
    description: string
) : ValidationResault => {
    
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100){
        return { valid: false, message: "Mountain name must be between 2 and 100 characters." };
    }

    if (typeof country !== "string" || country.trim().length < 2 || country.trim().length > 100){
        return { valid: false, message: "Country must be between 2 and 100 characters." };
    }
   
    if (typeof region !== "string" || region.trim().length < 2 || region.trim().length > 100){
        return { valid: false, message: "Region must be between 2 and 100 characters." }
    }

    if (!Number.isInteger(height) || height <= 0){
        return { valid: false, message: "Height must be greater than 0." };
    }

    if (typeof description !== "string" || description.length > 2000){
        return { valid: false, message: "Description cannot be longer than 2000 characters." }
    }

    return { valid: true, message: "" }
};