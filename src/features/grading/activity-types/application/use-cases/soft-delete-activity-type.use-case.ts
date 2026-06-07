import type { ActivityTypeRepositoryT } from "../../domain/repositories/activity-types.repository";
import type { ActivityTypeT } from "../../domain/entities/activity-types.types";

export const softDeleteActivityTypeUseCase = async (
  repository: ActivityTypeRepositoryT,
  id: number,
): Promise<ActivityTypeT> => {
  return repository.softDelete(id);
};
