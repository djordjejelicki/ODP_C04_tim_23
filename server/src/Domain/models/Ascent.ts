export class Ascent {
    public constructor(
        public id: number = 0,
        public user_id: number = 0,
        public trail_id: number = 0,
        public datum: Date | null = null,
        public trajanje_min: number = 0,
        public napomena: string | null = null,
        public ocena: number = 0
    ){}
}