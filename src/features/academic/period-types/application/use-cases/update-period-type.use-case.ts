import type { PeriodTypeRepositoryT } from "../../domain/repositories/period-types.repository";
import type { PeriodTypeT } from "../../domain/entities/period-types.types";

export const updatePeriodTypeUseCase = async (
  repository: PeriodTypeRepositoryT,
  id: number,
  data: Partial<PeriodTypeT>,
): Promise<PeriodTypeT> => {
  return repository.update(id, data);
};
