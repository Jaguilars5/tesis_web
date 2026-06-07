import type { StudentNoteRepositoryT } from "../../domain/repositories/student-notes.repository";
import type { StudentNoteT } from "../../domain/entities/student-notes.types";

export const listStudentNotesUseCase = async (
  repository: StudentNoteRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<StudentNoteT[]> => {
  return repository.list(params);
};
