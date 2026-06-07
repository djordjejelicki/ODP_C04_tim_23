import type { ValidationResult } from "../types/validation/ValidationResult";

export const validateMountain = (
    name: string,
    country: string,
    region: string | null,
    height: number,
    description: string | null
): ValidationResult => {

    if (name.trim().length < 2 || name.trim().length > 100) {
        return { valid: false, message: "Mountain name must be between 2 and 100 characters."
        };
    }

    if (country.trim().length < 2 || country.trim().length > 100) {
        return { valid: false, message: "Country must be between 2 and 100 characters." };
    }

    if (region !== null && region.trim().length > 100) {
        return { valid: false, message: "Region must be between 2 and 100 characters." };
    }

    if (!Number.isFinite(height) || height <= 0) {
        return { valid: false, message: "Height must be greater than 0."
        };
    }

    if (description !== null && description.trim().length > 2000) {
        return { valid: false, message: "Description cannot be longer than 2000 characters." };
    }

    return { valid: true, message: "" };
};