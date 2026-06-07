import type { RequestStatusT } from "@shared/types/commonTypes";
import type { AcademicSubnivelT } from "../domain/entities/academic-subnivel.types";

export interface AcademicSubnivelStateT {
  academicSubnivels: AcademicSubnivelT[];
  status: RequestStatusT;
  error: string | null;
}
