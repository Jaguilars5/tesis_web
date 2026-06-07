import type { PeriodGradeSummaryRepositoryT } from "../../domain/repositories/period-grade-summaries.repository";
import type { PeriodGradeSummaryT } from "../../domain/entities/period-grade-summaries.types";

export const createPeriodGradeSummaryUseCase = async (
  repository: PeriodGradeSummaryRepositoryT,
  data: Omit<PeriodGradeSummaryT, "id" | "enrollment_name" | "subject_offering_name" | "academic_period_name" | "qualitative_scale_name" | "calculated_at">,
): Promise<PeriodGradeSummaryT> => {
  return repository.create(data);
};
