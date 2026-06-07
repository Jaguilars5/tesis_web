import type { RequestStatusT } from "@shared/types/commonTypes";
import type { SubjectT } from "../domain/entities/subject.types";

export interface SubjectStateT {
  subjects: SubjectT[];
  status: RequestStatusT;
  error: string | null;
}
