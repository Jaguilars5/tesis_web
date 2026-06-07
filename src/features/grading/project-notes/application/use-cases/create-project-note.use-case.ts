import type { ProjectNoteRepositoryT, ProjectNoteCreateDataT } from "../../domain/repositories/project-notes.repository";
import type { ProjectNoteT } from "../../domain/entities/project-notes.types";

export const createProjectNoteUseCase = async (
  repository: ProjectNoteRepositoryT,
  data: ProjectNoteCreateDataT,
): Promise<ProjectNoteT> => {
  return repository.create(data);
};
