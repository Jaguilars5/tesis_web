import type { PeriodGradeSummaryRepositoryT } from "../../domain/repositories/period-grade-summaries.repository";
import type { PeriodGradeSummaryT } from "../../domain/entities/period-grade-summaries.types";

export const updatePeriodGradeSummaryUseCase = async (
  repository: PeriodGradeSummaryRepositoryT,
  id: number,
  data: Partial<PeriodGradeSummaryT>,
): Promise<PeriodGradeSummaryT> => {
  return repository.update(id, data);
};
