import type { RequestStatusT } from "@shared/types/commonTypes";
import type { SubjectAcademicConfigT } from "../domain/entities/subject-academic-config.entity";

export interface SubjectAcademicConfigStateT {
  subjectAcademicConfigs: SubjectAcademicConfigT[];
  status: RequestStatusT;
  error: string | null;
}
