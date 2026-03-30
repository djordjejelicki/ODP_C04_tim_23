export class Trail {
  public constructor(
    public id: number = 0,
    public mountain_id: number = 0,
    public naziv: string = '',
    public opis: string | null = null,
    public duzina_km: number = 0,
    public tezina: 'easy' | 'moderate' | 'hard' | 'expert' = 'easy',
    public trajanje_min: number = 0,
    public visinski_uspon_m: number = 0,
    public slika_url: string = '',
    public created_at: Date | null = null
  ) {}
}