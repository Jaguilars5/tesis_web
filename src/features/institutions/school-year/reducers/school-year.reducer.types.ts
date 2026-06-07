import type { RequestStatusT } from "@shared/types/commonTypes";
import type { SchoolYearT } from "../domain/entities/school-year.types";

export interface SchoolYearStateT {
  schoolYears: SchoolYearT[];
  status: RequestStatusT;
  error: string | null;
}
