import type { PeriodGradeSummaryRepositoryT } from "../../domain/repositories/period-grade-summaries.repository";
import type { PeriodGradeSummaryT } from "../../domain/entities/period-grade-summaries.types";

export const listPeriodGradeSummariesUseCase = async (
  repository: PeriodGradeSummaryRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<PeriodGradeSummaryT[]> => {
  return repository.list(params);
};
