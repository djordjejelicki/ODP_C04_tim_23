export class Mountain {
    public constructor(
        public id: number = 0,
        public name: string = '',
        public country: string = '',
        public region: string | null = null,
        public height: number = 0,
        public description: string | null = null,
        public created_at: Date | null = null
    ){}
}