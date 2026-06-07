import type { RequestStatusT } from "@shared/types/commonTypes";
import type { ProjectNoteT } from "../domain/entities/project-notes.types";

export interface ProjectNotesStateT {
  projectNotes: ProjectNoteT[];
  status: RequestStatusT;
  error: string | null;
}
