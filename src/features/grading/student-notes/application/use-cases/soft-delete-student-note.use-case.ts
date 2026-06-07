import type { StudentNoteRepositoryT } from "../../domain/repositories/student-notes.repository";
import type { StudentNoteT } from "../../domain/entities/student-notes.types";

export const softDeleteStudentNoteUseCase = async (
  repository: StudentNoteRepositoryT,
  id: number,
): Promise<StudentNoteT> => {
  return repository.softDelete(id);
};
