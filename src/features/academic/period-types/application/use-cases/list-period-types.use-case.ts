import type { PeriodTypeRepositoryT } from "../../domain/repositories/period-types.repository";
import type { PeriodTypeT } from "../../domain/entities/period-types.types";

export const listPeriodTypesUseCase = async (
  repository: PeriodTypeRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<PeriodTypeT[]> => {
  return repository.list(params);
};
