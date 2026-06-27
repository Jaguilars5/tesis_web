export interface ResponseApi<T> {
  ok: boolean;
  msg: string;
  data: T;
}

export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginatedResponseApi<T> {
  ok: boolean;
  msg: string;
  data: PaginatedData<T>;
}

export interface PaginatedResult<T> {
  items: T[];
  count: number;
}
