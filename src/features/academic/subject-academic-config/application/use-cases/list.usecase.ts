import type { SubjectAcademicConfigT } from "../../domain/entities/subject-academic-config.entity";
import { subjectAcademicConfigRepository } from "../../infrastructure/repositories/subject-academic-config.repository.impl";

export const listSubjectAcademicConfigsUseCase = async (
  params?: { page?: number; pageSize?: number },
): Promise<SubjectAcademicConfigT[]> => {
  return subjectAcademicConfigRepository.list(params);
};
