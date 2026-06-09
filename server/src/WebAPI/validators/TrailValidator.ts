import { TrailDifficulty } from "../../Domain/enums/TrailDifficulty";
import { ValidationResault } from "../../Domain/types/ValidationResult";


export const validateTrail = (
    mountain_id: number, 
    name: string,
    description: string,
    length_km: number,
    difficulty: string,
    est_duration_min: number,
    elevation_m: number,
    image_url: string,
    terrain_tag_ids: number[]
): ValidationResault => {
    if (!Number.isInteger(mountain_id) || mountain_id <= 0){
        return { valid: false, message: "Mountain is required." };
    }

    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120){
        return { valid: false, message: "Trail name must be between 2 and 120 characters." };
    }

    if (typeof description !== "string" || description.length > 2000){
        return { valid: false, message: "Trail description cannot be longer than 2000 characters."};
    }

    if (typeof length_km !== "number" || Number.isNaN(length_km) || length_km < 0.1){
        return { valid: false, message: "Trail length must be at least 0.1 km." };
    }

    if (!Object.values(TrailDifficulty).includes(difficulty as TrailDifficulty)){
        return { valid: false, message: "Please choose a valid difficulty level." };
    }

    if (!Number.isInteger(est_duration_min) || est_duration_min < 10){
        return { valid: false, message: "Estimated duration must be at least 10 minutes." };
    }

    if (!Number.isInteger(elevation_m) || elevation_m < 0 ){
        return { valid: false, message: "Elevation gain must be 0 or greater." };
    }

    if (typeof image_url !== "string" || image_url.trim().length === 0 || image_url.length > 255){
        return { valid: false, message: "Trail image is required." }
    }
    
    if (!Array.isArray(terrain_tag_ids) || terrain_tag_ids.length === 0) {
        return { valid: false, message: "Trail must have at least one terrain tag."}
    }
    return {valid: true, message: ""};
}