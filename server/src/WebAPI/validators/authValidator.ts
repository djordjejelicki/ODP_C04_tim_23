import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateRegister = (
    username: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string
): ValidationResault => {
    const usernameRegex = /^[a-zA-Z0-9-]{3,40}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (typeof username !== "string" || !usernameRegex.test(username)){
        return { valid: false, message: "Username must be 3-40 characters long and contain only letters, numbers, and hyphens" };
    }

    if (typeof email !== "string" || !emailRegex.test(email)){
        return { valid: false, message: "Please enter a valid email address" };
    }

    if (typeof password !== "string" || !passwordRegex.test(password)){
        return { valid: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter and one number" };
    }

    if (typeof first_name !== "string" || first_name.trim().length < 2 || first_name.trim().length > 50){
        return {valid: false, message: "First name must be between 2 and 50 characters" };
    }

    if (typeof last_name !== "string" || last_name.trim().length < 2 || last_name.trim().length > 50){
        return {valid: false, message: "Last name must be between 2 and 50 characters" };
    }

    return { valid: true, message: "" };
}

export const validateLogin = (
    username: string,
    password: string
): ValidationResault => {
    
    if (typeof username !== "string" || username.trim().length === 0){
        return { valid: false, message: "Username is required" };
    }

    if (typeof password !== "string" || password.trim().length === 0){
        return { valid: false, message: "Password is required" };
    }

    return { valid: true, message: "" };
};