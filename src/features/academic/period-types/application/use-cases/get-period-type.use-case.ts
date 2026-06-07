import type { PeriodTypeRepositoryT } from "../../domain/repositories/period-types.repository";
import type { PeriodTypeT } from "../../domain/entities/period-types.types";

export const getPeriodTypeUseCase = async (
  repository: PeriodTypeRepositoryT,
  id: number,
): Promise<PeriodTypeT> => {
  return repository.get(id);
};
