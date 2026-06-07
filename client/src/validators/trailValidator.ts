import type { ValidationResult } from "../types/validation/ValidationResult";
import { TRAIL_DIFFICULTIES } from "../types/trails/TrailDifficulty";
import type { TrailDifficulty } from "../types/trails/TrailDifficulty";

export const validateTrail = (
    mountain_id: number,
    name: string,
    description: string | null,
    length_km: number,
    difficulty: string,
    est_duration_min: number,
    elevation_m: number,
    image_url: string,
    image: File | null,
    terrain_tag_ids: number[],
    isEditing: boolean
): ValidationResult => {

    if (!Number.isInteger(mountain_id) || mountain_id <= 0) {
        return { valid: false, message: "Mountain is required." };
    }

    if ( typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120) {
        return { valid: false, message: "Trail name must be between 2 and 120 characters." };
    }

    if ( description !== null && description.length > 2000) {
        return { valid: false, message: "Trail description cannot be longer than 2000 characters." };
    }

    if ( typeof length_km !== "number" || Number.isNaN(length_km) || length_km < 0.1) {
        return { valid: false, message: "Trail length must be at least 0.1 km." };
    }

    if (!TRAIL_DIFFICULTIES.includes(difficulty as TrailDifficulty)) {
        return { valid: false, message: "Please choose a valid difficulty level." };
    }

    if ( !Number.isInteger(est_duration_min) || est_duration_min < 10) {
        return { valid: false, message: "Estimated duration must be at least 10 minutes." };
    }

    if ( !Number.isInteger(elevation_m) || elevation_m < 0) {
        return { valid: false, message: "Elevation gain must be 0 or greater." };
    }

    if ( !isEditing && image === null) {
        return { valid: false, message: "Trail image is required." };
    }

    if ( isEditing && !image && image_url.trim().length === 0) {
        return { valid: false, message: "Trail image is required."};
    }

    if ( !Array.isArray(terrain_tag_ids) || terrain_tag_ids.length === 0) {
        return { valid: false, message: "Trail must have at least one terrain tag." };
    }

    return { valid: true, message: "" };
};