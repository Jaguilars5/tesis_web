import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface ActivityTypeT {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ActivityTypeOrderingT = "name" | "-name" | "code" | "-code";

export interface ActivityTypeListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: ActivityTypeOrderingT;
}

export interface ActivityTypeFormValues {
  code: string;
  name: string;
  description?: string;
}

export type ActivityTypeCreateParamsT = ActivityTypeFormValues;
export type ActivityTypeUpdateDataT = Partial<ActivityTypeFormValues>;
export interface ActivityTypeUpdateParamsT {
  id: number;
  data: ActivityTypeUpdateDataT;
}
export interface ActivityTypeGetParamsT {
  id: number;
}
export interface ActivityTypeDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface ActivityTypeServiceT {
  list(params?: ActivityTypeListParamsT): Promise<ActivityTypeT[]>;
  get(params: ActivityTypeGetParamsT): Promise<ActivityTypeT>;
  create(params: ActivityTypeCreateParamsT): Promise<ActivityTypeT>;
  update(params: ActivityTypeUpdateParamsT): Promise<ActivityTypeT>;
  softDelete(params: ActivityTypeDeleteParamsT): Promise<SoftDeleteResponseT>;
}
