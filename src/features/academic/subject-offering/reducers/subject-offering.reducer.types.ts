import type { RequestStatusT } from "@shared/types/commonTypes";
import type { SubjectOfferingT } from "../domain/entities/subject-offering.types";

export interface SubjectOfferingStateT {
  subjectOfferings: SubjectOfferingT[];
  status: RequestStatusT;
  error: string | null;
}
