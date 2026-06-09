export class PublicUserDto {
    public constructor (
        public id: number = 0,
        public username: string = "",
        public first_name: string = "",
        public last_name: string = "",
        public bio: string = "",
        public avatar_url: string = ""
    ) {}
}