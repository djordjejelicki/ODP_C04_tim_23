export class PublicUSerDto {
    public constructor (
        public id: number = 0,
        public username: string = "",
        public first_name: string = "",
        public last_name: string = "",
        public bio: string | null = null,
        public avatar_url: string | null = null
    ) {}
}