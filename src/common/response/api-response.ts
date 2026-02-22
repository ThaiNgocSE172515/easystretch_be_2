export class ApiResponse {
  success: boolean;
  code: number;
  message: string;
  data?: any;


  constructor(success: boolean, code: number, message: string, data: any) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message: string = 'Thành công', code: number = 200) {
    return new ApiResponse(true, code, message, data);
  }

  static error(message: string, code: number = 400) {
    return new ApiResponse(false, code, message, null);
  }
}