class ApiError {
  constructor(
    public statusCode: number,
    public error: any,
    public success: boolean,
    public message?: string
  ) {}
}

export default ApiError;
