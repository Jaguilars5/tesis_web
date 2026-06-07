import type { RequestStatusT } from "@shared/types/commonTypes";
import type { AcademicLevelT } from "../domain/entities/academic-level.types";

export interface AcademicLevelStateT {
  academicLevels: AcademicLevelT[];
  status: RequestStatusT;
  error: string | null;
}
