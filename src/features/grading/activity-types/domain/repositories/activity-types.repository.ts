import type { ActivityTypeT } from "../entities/activity-types.types";
export interface ActivityTypeListParamsT { page?: number; pageSize?: number; }
export interface ActivityTypeRepositoryT {
  list(params?: ActivityTypeListParamsT): Promise<ActivityTypeT[]>;
  get(id: number): Promise<ActivityTypeT>;
  create(data: Omit<ActivityTypeT, "id" | "is_active" | "created_at" | "updated_at">): Promise<ActivityTypeT>;
  update(id: number, data: Partial<ActivityTypeT>): Promise<ActivityTypeT>;
  softDelete(id: number): Promise<ActivityTypeT>;
}
