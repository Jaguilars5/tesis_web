import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";
import { subjectOfferingApiRepository } from "../../infrastructure/repositories/subject-offering-api.repository";

export const updateSubjectOfferingUseCase = async (
  id: number,
  data: Partial<SubjectOfferingT>,
): Promise<SubjectOfferingT> => {
  return subjectOfferingApiRepository.update(id, data);
};
