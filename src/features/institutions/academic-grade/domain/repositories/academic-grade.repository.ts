import type { AcademicGradeT } from "../entities/academic-grade.types";

export interface AcademicGradeListParamsT {
  page?: number;
  pageSize?: number;
}

export interface AcademicGradeRepositoryT {
  list(params?: AcademicGradeListParamsT): Promise<AcademicGradeT[]>;
  get(id: number): Promise<AcademicGradeT>;
  create(data: Omit<AcademicGradeT, "id" | "is_active" | "academic_level_name">): Promise<AcademicGradeT>;
  update(id: number, data: Partial<AcademicGradeT>): Promise<AcademicGradeT>;
  softDelete(id: number): Promise<AcademicGradeT>;
}
