import type { RequestStatusT } from "@shared/types/commonTypes";
import type { ActivityTypeT } from "../domain/entities/activity-types.types";

export interface ActivityTypesStateT {
  activityTypes: ActivityTypeT[];
  status: RequestStatusT;
  error: string | null;
}
