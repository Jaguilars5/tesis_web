import type { ProjectNoteRepositoryT } from "../../domain/repositories/project-notes.repository";
import type { ProjectNoteT } from "../../domain/entities/project-notes.types";

export const updateProjectNoteUseCase = async (
  repository: ProjectNoteRepositoryT,
  id: number,
  data: Partial<ProjectNoteT>,
): Promise<ProjectNoteT> => {
  return repository.update(id, data);
};
