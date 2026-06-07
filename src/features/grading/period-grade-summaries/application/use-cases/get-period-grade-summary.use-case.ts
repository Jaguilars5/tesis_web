import type { PeriodGradeSummaryRepositoryT } from "../../domain/repositories/period-grade-summaries.repository";
import type { PeriodGradeSummaryT } from "../../domain/entities/period-grade-summaries.types";

export const getPeriodGradeSummaryUseCase = async (
  repository: PeriodGradeSummaryRepositoryT,
  id: number,
): Promise<PeriodGradeSummaryT> => {
  return repository.get(id);
};
