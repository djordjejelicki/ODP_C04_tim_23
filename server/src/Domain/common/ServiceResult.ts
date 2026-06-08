export class ServiceResult {
    private constructor(
        public success: boolean,
        public message: string,
    ){}

    static ok(message: string): ServiceResult {
        return new ServiceResult(true, message);
    }

    static fail(message: string): ServiceResult {
        return new ServiceResult(false, message);
    }
}