export class ServiceResult<T> {
    public constructor(
        public success: boolean,
        public message: string,
        public data: T | null = null
    ){}

    public static ok<T>(message: string, data: T | null = null): ServiceResult<T> {
        return new ServiceResult<T>(true, message, data);
    }

    public static fail<T>(message: string): ServiceResult<T> {
        return new ServiceResult<T>(false, message, null);
    }
}