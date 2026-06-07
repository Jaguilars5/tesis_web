import type { SubjectAcademicConfigT } from "../entities/subject-academic-config.entity";

export interface SubjectAcademicConfigRepositoryT {
  list(params?: { page?: number; pageSize?: number }): Promise<SubjectAcademicConfigT[]>;
  get(id: number): Promise<SubjectAcademicConfigT>;
  create(data: Omit<SubjectAcademicConfigT, "id" | "is_active" | "subject_name" | "academic_grade_name">): Promise<SubjectAcademicConfigT>;
  update(id: number, data: Partial<SubjectAcademicConfigT>): Promise<SubjectAcademicConfigT>;
  softDelete(id: number): Promise<SubjectAcademicConfigT>;
}
