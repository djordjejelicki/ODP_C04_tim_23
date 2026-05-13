export class AscentDetailsDto {
    public constructor(
        public id: number = 0,
        public user_id: number = 0,
        public trail_id: number = 0,
        public trail_name: string = "",
        public ascent_date: Date | null = null,
        public duration_min: number = 0,
        public note: string | null = null,
        public rating: number = 0
    ){}
}