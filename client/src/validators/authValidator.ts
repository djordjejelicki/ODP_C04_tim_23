import type { ValidationResult } from "../types/validation/ValidationResult";

export const validateLogin = (
    username: string,
    password: string
): ValidationResult => {

    if (username.trim().length === 0) {
        return { valid: false, message: "Username is required." };
    }

    if (password.trim().length === 0) {
        return { valid: false, message: "Password is required."};
    }

    return { valid: true, message: "" };
};

export const validateRegister = (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
): ValidationResult => {

    const usernameRegex = /^[a-zA-Z0-9-]{3,40}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!usernameRegex.test(username)) {
        return { valid: false, message: "Username must be 3-40 characters long and contain only letters, numbers, and hyphens."
        };
    }

    if (!emailRegex.test(email)) {
        return { valid: false, message: "Please enter a valid email address."
        };
    }

    if (!passwordRegex.test(password)) {
        return { valid: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter and one number."};
    }

    if (firstName.trim().length < 2 || firstName.trim().length > 50) {
        return { valid: false, message: "First name must be between 2 and 50 characters." };
    }

    if (lastName.trim().length < 2 || lastName.trim().length > 50) {
        return { valid: false, message: "Last name must be between 2 and 50 characters." };
    }

    return { valid: true, message: "" };
};