import type { RequestStatusT } from "@shared/types/commonTypes";
import type { SubjectProjectT } from "../domain/entities/subject-project.types";

export interface SubjectProjectStateT {
  subjectProjects: SubjectProjectT[];
  status: RequestStatusT;
  error: string | null;
}
