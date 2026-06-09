export class Ascent {
    public constructor(
        public id: number = 0,
        public user_id: number = 0,
        public trail_id: number = 0,
        public ascent_date: Date = new Date(),
        public duration_min: number = 0,
        public note: string = "",
        public rating: number = 0
    ){}
}