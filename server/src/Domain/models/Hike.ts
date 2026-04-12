export class Hike {
    public constructor(
        public id: number = 0,
        public organizator_id: number = 0,
        public trail_id: number = 0,
        public naziv: string = "",
        public opis: string | null = null,
        public datum_vreme: Date | null = null,
        public maksimalan_broj_ucesnika: number = 0
    ){}
}