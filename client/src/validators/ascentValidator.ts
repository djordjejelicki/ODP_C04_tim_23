import type { ValidationResult } from "../types/validation/ValidationResult";

export const validateAscent = (
    trail_id: number,
    ascent_date: string,
    duration_min: number,
    note: string,
    rating: number
): ValidationResult => {

    if (!Number.isInteger(trail_id) || trail_id <= 0) {
        return { valid: false, message: "Trail is required." };
    }

    if (typeof ascent_date !== "string" || ascent_date.trim().length === 0) {
        return { valid: false, message: "Ascent date is required." };
    }

    const ascentDate = new Date(ascent_date);

    if (Number.isNaN(ascentDate.getTime())) {
        return { valid: false, message: "Ascent date is invalid." };
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (ascentDate > today) {
        return { valid: false, message: "Ascent date cannot be in the future." };
    }

    if (!Number.isInteger(duration_min) || duration_min < 1) {
        return { valid: false, message: "Duration must be a positive whole number." };
    }

    if (note.length > 2000) {
        return { valid: false, message: "Note cannot be longer than 2000 characters." };
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
        return { valid: false, message: "Rating must be between 1 and 10." };
    }

    return { valid: true, message: "" };
};