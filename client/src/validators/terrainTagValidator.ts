import type { ValidationResult } from "../types/validation/ValidationResult";

export const validateTerrainTag = (
    name: string,
    description: string | null
): ValidationResult => {
    if (name.trim().length < 2 || name.trim().length > 100) {
        return { valid: false, message: "Terrain tag name must be between 2 and 100 characters."};
    }

    if (description !== null && description.length > 1000) {
        return { valid: false, message: "Description cannot be longer than 1000 characters."};
    }

    return { valid: true, message: "" };
};