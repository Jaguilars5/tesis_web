import type { AcademicPeriodT } from "../entities/academic-period.types";

export interface AcademicPeriodListParamsT {
  page?: number;
  pageSize?: number;
}

export interface AcademicPeriodRepositoryT {
  list(params?: AcademicPeriodListParamsT): Promise<AcademicPeriodT[]>;
  get(id: number): Promise<AcademicPeriodT>;
  create(data: Omit<AcademicPeriodT, "id" | "is_active" | "school_year_name">): Promise<AcademicPeriodT>;
  update(id: number, data: Partial<AcademicPeriodT>): Promise<AcademicPeriodT>;
  softDelete(id: number): Promise<AcademicPeriodT>;
}
