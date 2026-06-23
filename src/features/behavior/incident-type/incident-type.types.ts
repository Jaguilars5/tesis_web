export interface IncidentTypeT {
  id: number; code: string; name: string; description: string; is_active: boolean; created_at: string; updated_at: string;
}
export type IncidentTypeOrderingT = "name" | "-name" | "code" | "-code";
export interface IncidentTypeListParamsT { page?: number; pageSize?: number; search?: string; ordering?: IncidentTypeOrderingT; }
export type IncidentTypeCreateDataT = Omit<IncidentTypeT, "id" | "is_active" | "created_at" | "updated_at">;
export type IncidentTypeCreateParamsT = IncidentTypeCreateDataT;
export type IncidentTypeUpdateDataT = Partial<Omit<IncidentTypeT, "id">>;
export interface IncidentTypeUpdateParamsT { id: number; data: IncidentTypeUpdateDataT; }
export type IncidentTypeGetParamsT = number;
export type IncidentTypeDeleteParamsT = number;
export interface IncidentTypeServiceT {
  list(params?: IncidentTypeListParamsT): Promise<IncidentTypeT[]>;
  get(id: IncidentTypeGetParamsT): Promise<IncidentTypeT>;
  create(data: IncidentTypeCreateDataT): Promise<IncidentTypeT>;
  update(params: IncidentTypeUpdateParamsT): Promise<IncidentTypeT>;
  softDelete(id: IncidentTypeDeleteParamsT): Promise<{ id: number }>;
}
export interface IncidentTypeFormValues { code: string; name: string; description: string; is_active: boolean; }
