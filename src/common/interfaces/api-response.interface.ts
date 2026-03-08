export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}