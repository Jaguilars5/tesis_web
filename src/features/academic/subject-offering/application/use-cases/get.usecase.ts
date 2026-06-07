import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";
import { subjectOfferingApiRepository } from "../../infrastructure/repositories/subject-offering-api.repository";

export const getSubjectOfferingUseCase = async (id: number): Promise<SubjectOfferingT> => {
  return subjectOfferingApiRepository.get(id);
};
