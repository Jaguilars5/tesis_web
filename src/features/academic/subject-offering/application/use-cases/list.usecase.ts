import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";
import type { SubjectOfferingListParamsT } from "../../domain/repositories/subject-offering.repository";
import { subjectOfferingApiRepository } from "../../infrastructure/repositories/subject-offering-api.repository";

export const listSubjectOfferingsUseCase = async (
  params?: SubjectOfferingListParamsT,
): Promise<SubjectOfferingT[]> => {
  return subjectOfferingApiRepository.list(params);
};
