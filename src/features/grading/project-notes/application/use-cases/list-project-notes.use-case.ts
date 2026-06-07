import type { ProjectNoteRepositoryT } from "../../domain/repositories/project-notes.repository";
import type { ProjectNoteT } from "../../domain/entities/project-notes.types";

export const listProjectNotesUseCase = async (
  repository: ProjectNoteRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<ProjectNoteT[]> => {
  return repository.list(params);
};
