import type { StudentNoteRepositoryT } from "../../domain/repositories/student-notes.repository";
import type { StudentNoteT } from "../../domain/entities/student-notes.types";

export const updateStudentNoteUseCase = async (
  repository: StudentNoteRepositoryT,
  id: number,
  data: Partial<StudentNoteT>,
): Promise<StudentNoteT> => {
  return repository.update(id, data);
};
