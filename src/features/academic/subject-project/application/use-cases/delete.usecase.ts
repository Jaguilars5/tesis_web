import { subjectProjectApiRepository } from "../../infrastructure/repositories/subject-project-api.repository";

export const deleteSubjectProjectUseCase = async (id: number): Promise<void> => {
  return subjectProjectApiRepository.delete(id);
};
