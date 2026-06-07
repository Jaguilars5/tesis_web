import type { ActivityTypeRepositoryT } from "../../domain/repositories/activity-types.repository";
import type { ActivityTypeT } from "../../domain/entities/activity-types.types";

export const updateActivityTypeUseCase = async (
  repository: ActivityTypeRepositoryT,
  id: number,
  data: Partial<ActivityTypeT>,
): Promise<ActivityTypeT> => {
  return repository.update(id, data);
};
