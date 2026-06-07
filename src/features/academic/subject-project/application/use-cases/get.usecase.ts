import type { SubjectProjectT } from "../../domain/entities/subject-project.types";
import { subjectProjectApiRepository } from "../../infrastructure/repositories/subject-project-api.repository";

export const getSubjectProjectUseCase = async (id: number): Promise<SubjectProjectT> => {
  return subjectProjectApiRepository.get(id);
};
