export class Mountain {
    public constructor(
        public id: number = 0,
        public naziv: string = '',
        public drzava: string = '',
        public region: string | null = null,
        public visina: number = 0,
        public opis: string | null = null,
        public created_at: Date | null = null
    ){}
}