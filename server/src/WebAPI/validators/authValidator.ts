import { ValidationResault } from "../../Domain/types/ValidationResult";

export const validateRegister = (
    korisnickoIme: string,
    email: string,
    lozinka: string,
    ime: string,
    prezime: string
): ValidationResault => {
    const usernameRegex = /^[a-zA-Z0-9-]{3,40}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (typeof korisnickoIme !== "string" || !usernameRegex.test(korisnickoIme)){
        return { valid: false, message: "Korisnicko ime nije validno" };
    }

    if (typeof email !== "string" || !emailRegex.test(email)){
        return { valid: false, message: "Email ne ispunjava uslove" };
    }

    if (typeof lozinka !== "string" || !passwordRegex.test(lozinka)){
        return { valid: false, message: "Lozinka ne ispunjava uslove" };
    }

    if (typeof ime !== "string" || ime.trim().length < 2 || ime.trim().length > 50){
        return {valid: false, message: "Ime nije validno" };
    }

    if (typeof prezime !== "string" || prezime.trim().length < 2 || prezime.trim().length > 50){
        return {valid: false, message: "Prezime nije validno" };
    }

    return { valid: true, message: "" };
}

export const validateLogin = (
    korisnickoIme: string,
    lozinka: string
): ValidationResault => {
    
    if (typeof korisnickoIme !== "string" || korisnickoIme.trim().length === 0){
        return { valid: false, message: "Korisnicko ime je obavezno" };
    }

    if (typeof lozinka !== "string" || lozinka.trim().length === 0){
        return { valid: false, message: "Lozinka je obavezna" };
    }

    return { valid: true, message: "" };
};