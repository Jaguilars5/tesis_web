import type { SubjectProjectT } from "../../domain/entities/subject-project.types";
import { subjectProjectApiRepository } from "../../infrastructure/repositories/subject-project-api.repository";

export const createSubjectProjectUseCase = async (
  data: Omit<SubjectProjectT, "id" | "interdisciplinary_project_title" | "subject_offering_name">,
): Promise<SubjectProjectT> => {
  return subjectProjectApiRepository.create(data);
};
