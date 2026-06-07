import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";
import { subjectOfferingApiRepository } from "../../infrastructure/repositories/subject-offering-api.repository";

export const createSubjectOfferingUseCase = async (
  data: Omit<SubjectOfferingT, "id" | "is_active" | "school_year_name" | "section_name" | "subject_academic_config_name">,
): Promise<SubjectOfferingT> => {
  return subjectOfferingApiRepository.create(data);
};
