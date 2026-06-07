import type { SchoolYearT } from "../entities/school-year.types";

export interface SchoolYearListParamsT {
  page?: number;
  pageSize?: number;
}

export interface SchoolYearRepositoryT {
  list(params?: SchoolYearListParamsT): Promise<SchoolYearT[]>;
  get(id: number): Promise<SchoolYearT>;
  create(data: Omit<SchoolYearT, "id" | "is_active">): Promise<SchoolYearT>;
  update(id: number, data: Partial<SchoolYearT>): Promise<SchoolYearT>;
  softDelete(id: number): Promise<SchoolYearT>;
}
