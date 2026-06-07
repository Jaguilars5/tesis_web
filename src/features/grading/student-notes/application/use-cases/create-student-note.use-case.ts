import type { StudentNoteRepositoryT, StudentNoteCreateDataT } from "../../domain/repositories/student-notes.repository";
import type { StudentNoteT } from "../../domain/entities/student-notes.types";

export const createStudentNoteUseCase = async (
  repository: StudentNoteRepositoryT,
  data: StudentNoteCreateDataT,
): Promise<StudentNoteT> => {
  return repository.create(data);
};
