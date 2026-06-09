export class Hike {
    public constructor(
        public id: number = 0,
        public organizer_id: number = 0,
        public trail_id: number = 0,
        public name: string = "",
        public description: string = "",
        public scheduled_at: Date = new Date(),
        public max_participants: number = 0
    ){}
}