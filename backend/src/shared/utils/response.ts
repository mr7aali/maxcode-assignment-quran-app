export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}

export function ok<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
}

export function fail(message: string): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: message,
    timestamp: new Date().toISOString(),
  };
}
