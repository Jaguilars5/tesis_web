import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";
import { subjectOfferingApiRepository } from "../../infrastructure/repositories/subject-offering-api.repository";

export const softDeleteSubjectOfferingUseCase = async (id: number): Promise<SubjectOfferingT> => {
  return subjectOfferingApiRepository.softDelete(id);
};
