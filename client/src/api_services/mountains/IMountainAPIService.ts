import type { Mountain } from "../../types/mountains/Mountain";

export interface IMountainAPIService {
    getAll(): Promise<Mountain[]>;
    create(
        name: string,
        country: string,
        region: string | null,
        height: number,
        description: string | null
    ): Promise<boolean>;
    update(
        id: number,
        name: string,
        country: string,
        region: string | null,
        height: number,
        description: string | null
    ): Promise<boolean>;
};