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
        return { valid: false, message: "Korisnicko ime nije validno" };
    }

    if (typeof email !== "string" || !emailRegex.test(email)){
        return { valid: false, message: "Email ne ispunjava uslove" };
    }

    if (typeof password !== "string" || !passwordRegex.test(password)){
        return { valid: false, message: "Lozinka ne ispunjava uslove" };
    }

    if (typeof first_name !== "string" || first_name.trim().length < 2 || first_name.trim().length > 50){
        return {valid: false, message: "Ime nije validno" };
    }

    if (typeof last_name !== "string" || last_name.trim().length < 2 || last_name.trim().length > 50){
        return {valid: false, message: "Prezime nije validno" };
    }

    return { valid: true, message: "" };
}

export const validateLogin = (
    username: string,
    password: string
): ValidationResault => {
    
    if (typeof username !== "string" || username.trim().length === 0){
        return { valid: false, message: "Korisnicko ime je obavezno" };
    }

    if (typeof password !== "string" || password.trim().length === 0){
        return { valid: false, message: "Lozinka je obavezna" };
    }

    return { valid: true, message: "" };
};