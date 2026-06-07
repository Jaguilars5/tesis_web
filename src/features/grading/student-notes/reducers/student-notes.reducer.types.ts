import type { RequestStatusT } from "@shared/types/commonTypes";
import type { StudentNoteT } from "../domain/entities/student-notes.types";

export interface StudentNotesStateT {
  studentNotes: StudentNoteT[];
  status: RequestStatusT;
  error: string | null;
}
