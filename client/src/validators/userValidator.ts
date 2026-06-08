import type { ValidationResult } from "../types/validation/ValidationResult";

export const validateUpdateProfile = (
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    bio: string | null
): ValidationResult => {
    const usernameRegex = /^[a-zA-Z0-9-]{3,40}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(username)) {
        return { valid: false, message: "Username must be 3-40 characters long and contain only letters, numbers, and hyphens." };
    }

    if (!emailRegex.test(email)) {
        return { valid: false, message: "Please enter a valid email address." };
    }

    if (firstName.trim().length < 2 || firstName.trim().length > 50) {
        return { valid: false, message: "First name must be between 2 and 50 characters." };
    }

    if (lastName.trim().length < 2 || lastName.trim().length > 50) {
        return { valid: false, message: "Last name must be between 2 and 50 characters." };
    }

    if (bio !== null && bio.length > 500) {
        return { valid: false, message: "Bio cannot be longer than 500 characters." };
    }

    return { valid: true, message: "" };
};

export const validateChangePassword = (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
): ValidationResult => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (currentPassword.trim().length === 0) {
        return { valid: false, message: "Current password is required." };
    }

    if (!passwordRegex.test(newPassword)) {
        return { valid: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter and one number." };
    }

    if (newPassword !== confirmPassword) {
        return { valid: false, message: "New passwords do not match." };
    }

    return { valid: true, message: "" };
};