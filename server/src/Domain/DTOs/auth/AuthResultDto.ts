import { UserRole } from "../../enums/UserRole";

export class AuthResultDto {
    public constructor(
        public success: boolean = false,
        public message: string = "",
        public id: number = 0,
        public korisnickoIme: string = "",
        public uloga: UserRole = UserRole.HIKER
    ){}
}