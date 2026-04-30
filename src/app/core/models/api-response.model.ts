export interface ApiResponse<T> {
  data: T;
  items: number;
  pages: number;
  first: number;
  last: number;
  prev: number | null;
  next: number | null;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
}
