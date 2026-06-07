import type { SubjectAcademicConfigRepositoryT } from "../../domain/repositories/subject-academic-config.repository";
import type { SubjectAcademicConfigT } from "../../domain/entities/subject-academic-config.entity";

export function createSubjectAcademicConfigUseCases(repo: SubjectAcademicConfigRepositoryT) {
  const fetchAll = (params?: { page?: number; pageSize?: number }) => repo.list(params);
  const fetchById = (id: number) => repo.get(id);
  const create = (data: Omit<SubjectAcademicConfigT, "id" | "is_active" | "subject_name" | "academic_grade_name">) => repo.create(data);
  const update = (id: number, data: Partial<SubjectAcademicConfigT>) => repo.update(id, data);
  const remove = (id: number) => repo.softDelete(id);
  return { fetchAll, fetchById, create, update, remove };
}
