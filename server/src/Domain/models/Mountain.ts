export class Mountain {
    public constructor(
        public id: number = 0,
        public name: string = '',
        public country: string = '',
        public region: string = '',
        public height: number = 0,
        public description: string = '',
        public created_at: Date = new Date()
    ){}
}