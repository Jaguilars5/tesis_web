import type { SectionT } from "../entities/section.types";

export interface SectionListParamsT {
  page?: number;
  pageSize?: number;
}

export interface SectionRepositoryT {
  list(params?: SectionListParamsT): Promise<SectionT[]>;
  get(id: number): Promise<SectionT>;
  create(data: Omit<SectionT, "id" | "is_active" | "school_year_name" | "academic_grade_name">): Promise<SectionT>;
  update(id: number, data: Partial<SectionT>): Promise<SectionT>;
  softDelete(id: number): Promise<SectionT>;
}
