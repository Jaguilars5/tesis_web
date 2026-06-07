import type { ActivityTypeRepositoryT } from "../../domain/repositories/activity-types.repository";
import type { ActivityTypeT } from "../../domain/entities/activity-types.types";

export const createActivityTypeUseCase = async (
  repository: ActivityTypeRepositoryT,
  data: Omit<ActivityTypeT, "id" | "is_active" | "created_at" | "updated_at">,
): Promise<ActivityTypeT> => {
  return repository.create(data);
};
