import type { ActivityTypeRepositoryT } from "../../domain/repositories/activity-types.repository";
import type { ActivityTypeT } from "../../domain/entities/activity-types.types";

export const listActivityTypesUseCase = async (
  repository: ActivityTypeRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<ActivityTypeT[]> => {
  return repository.list(params);
};
