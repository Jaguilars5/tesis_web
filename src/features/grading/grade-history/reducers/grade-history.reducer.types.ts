import type { RequestStatusT } from "@shared/types/commonTypes";
import type { GradeChangeHistoryT } from "../domain/entities/grade-history.types";

export interface GradeHistoryStateT {
  gradeHistoryItems: GradeChangeHistoryT[];
  status: RequestStatusT;
  error: string | null;
}
