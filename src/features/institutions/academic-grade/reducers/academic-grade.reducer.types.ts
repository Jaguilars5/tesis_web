import type { RequestStatusT } from "@shared/types/commonTypes";
import type { AcademicGradeT } from "../domain/entities/academic-grade.types";

export interface AcademicGradeStateT {
  academicGrades: AcademicGradeT[];
  status: RequestStatusT;
  error: string | null;
}
