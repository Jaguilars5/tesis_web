import type { StudentNoteRepositoryT } from "../../domain/repositories/student-notes.repository";
import type { StudentNoteT } from "../../domain/entities/student-notes.types";

export const getStudentNoteUseCase = async (
  repository: StudentNoteRepositoryT,
  id: number,
): Promise<StudentNoteT> => {
  return repository.get(id);
};
