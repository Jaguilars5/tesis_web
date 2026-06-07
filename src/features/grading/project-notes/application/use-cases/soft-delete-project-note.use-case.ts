import type { ProjectNoteRepositoryT } from "../../domain/repositories/project-notes.repository";
import type { ProjectNoteT } from "../../domain/entities/project-notes.types";

export const softDeleteProjectNoteUseCase = async (
  repository: ProjectNoteRepositoryT,
  id: number,
): Promise<ProjectNoteT> => {
  return repository.softDelete(id);
};
