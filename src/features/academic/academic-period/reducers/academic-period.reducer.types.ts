import type { RequestStatusT } from "@shared/types/commonTypes";
import type { AcademicPeriodT } from "../domain/entities/academic-period.types";

export interface AcademicPeriodStateT {
  academicPeriods: AcademicPeriodT[];
  status: RequestStatusT;
  error: string | null;
}
