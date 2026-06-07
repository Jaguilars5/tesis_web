import type { SubjectProjectT } from "../../domain/entities/subject-project.types";
import { subjectProjectApiRepository } from "../../infrastructure/repositories/subject-project-api.repository";

export const listSubjectProjectsUseCase = async (
  params?: { page?: number; pageSize?: number },
): Promise<SubjectProjectT[]> => {
  return subjectProjectApiRepository.list(params);
};
