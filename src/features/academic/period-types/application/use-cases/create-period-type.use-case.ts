import type { PeriodTypeRepositoryT } from "../../domain/repositories/period-types.repository";
import type { PeriodTypeT } from "../../domain/entities/period-types.types";

export const createPeriodTypeUseCase = async (
  repository: PeriodTypeRepositoryT,
  data: Omit<PeriodTypeT, "id" | "is_active">,
): Promise<PeriodTypeT> => {
  return repository.create(data);
};
