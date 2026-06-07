import type { AcademicSubnivelT } from "../entities/academic-subnivel.types";

export interface AcademicSubnivelListParamsT {
  page?: number;
  pageSize?: number;
}

export interface AcademicSubnivelRepositoryT {
  list(params?: AcademicSubnivelListParamsT): Promise<AcademicSubnivelT[]>;
  get(id: number): Promise<AcademicSubnivelT>;
  create(data: Omit<AcademicSubnivelT, "id" | "is_active" | "academic_level_name">): Promise<AcademicSubnivelT>;
  update(id: number, data: Partial<AcademicSubnivelT>): Promise<AcademicSubnivelT>;
  softDelete(id: number): Promise<AcademicSubnivelT>;
}
