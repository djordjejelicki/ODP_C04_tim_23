import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateHike = (
    trail_id: number,
    name: string,
    description: string,
    scheduled_at: string,
    max_participants: number
): ValidationResault => {

    if (!Number.isInteger(trail_id) || trail_id <= 0){
        return { valid: false, message: "Trail is required." };
    }

    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120){
        return { valid: false, message: "Hike name must be between 2 and 120 characters." };
    }

    if (typeof description !== "string" || description.length > 2000) {
        return { valid: false, message: "Description cannot be longer than 2000 characters." };
    }

    if (typeof scheduled_at !== "string" || scheduled_at.trim().length === 0){
        return { valid: false, message: "Scheduled date and time are required." };
    }

    const scheduledAt = new Date(scheduled_at);
    if (Number.isNaN(scheduledAt.getTime())){
        return { valid: false, message: "Scheduled date and time are invalid." };
    }

    if (scheduledAt <= new Date()){
        return {valid: false, message: "Hike date must be in the future." };
    }

    if (!Number.isInteger(max_participants) || max_participants < 2 || max_participants > 50) {
        return { valid: false, message: "Maximum participants must be between 2 and 50." };
    }

    return { valid: true, message: "" }
}