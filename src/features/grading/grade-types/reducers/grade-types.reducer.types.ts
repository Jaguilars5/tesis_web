import type { RequestStatusT } from "@shared/types/commonTypes";
import type { GradeTypeT } from "../domain/entities/grade-types.types";

export interface GradeTypesStateT {
  gradeTypes: GradeTypeT[];
  status: RequestStatusT;
  error: string | null;
}
