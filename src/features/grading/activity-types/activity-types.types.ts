export interface ActivityTypeT { id: number; code: string; name: string; description?: string; is_active: boolean; created_at: string; updated_at: string; }
export type ActivityTypeOrderingT = "name" | "-name" | "code" | "-code";
export interface ActivityTypeListParamsT { page?: number; pageSize?: number; search?: string; ordering?: ActivityTypeOrderingT; }
export type ActivityTypeCreateDataT = Omit<ActivityTypeT, "id" | "is_active" | "created_at" | "updated_at">;
export type ActivityTypeCreateParamsT = ActivityTypeCreateDataT;
export type ActivityTypeUpdateDataT = Partial<Omit<ActivityTypeT, "id">>;
export interface ActivityTypeUpdateParamsT { id: number; data: ActivityTypeUpdateDataT; }
export type ActivityTypeGetParamsT = number;
export type ActivityTypeDeleteParamsT = number;
export interface ActivityTypeServiceT { list(p?: ActivityTypeListParamsT): Promise<ActivityTypeT[]>; get(id: ActivityTypeGetParamsT): Promise<ActivityTypeT>; create(d: ActivityTypeCreateDataT): Promise<ActivityTypeT>; update(p: ActivityTypeUpdateParamsT): Promise<ActivityTypeT>; softDelete(id: ActivityTypeDeleteParamsT): Promise<{ id: number }>; }
export interface ActivityTypeFormValues { code: string; name: string; description?: string; is_active: boolean; }
