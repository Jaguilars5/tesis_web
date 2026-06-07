import type { TeacherSubjectSectionT } from "./teacher-subject-section.entity";

export interface TeacherSubjectSectionRepositoryT {
  list(params?: { page?: number; pageSize?: number }): Promise<TeacherSubjectSectionT[]>;
  get(id: number): Promise<TeacherSubjectSectionT>;
  create(data: Omit<TeacherSubjectSectionT, "id" | "is_active" | "user_name" | "subject_offering_name">): Promise<TeacherSubjectSectionT>;
  update(id: number, data: Partial<TeacherSubjectSectionT>): Promise<TeacherSubjectSectionT>;
  softDelete(id: number): Promise<TeacherSubjectSectionT>;
}
