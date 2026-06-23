export interface SeverityT { id: number; code: string; name: string; description: string; is_active: boolean; created_at: string; updated_at: string; }
export type SeverityOrderingT = "name" | "-name" | "code" | "-code";
export interface SeverityListParamsT { page?: number; pageSize?: number; search?: string; ordering?: SeverityOrderingT; }
export type SeverityCreateDataT = Omit<SeverityT, "id" | "is_active" | "created_at" | "updated_at">;
export type SeverityCreateParamsT = SeverityCreateDataT;
export type SeverityUpdateDataT = Partial<Omit<SeverityT, "id">>;
export interface SeverityUpdateParamsT { id: number; data: SeverityUpdateDataT; }
export type SeverityGetParamsT = number;
export type SeverityDeleteParamsT = number;
export interface SeverityServiceT { list(p?: SeverityListParamsT): Promise<SeverityT[]>; get(id: SeverityGetParamsT): Promise<SeverityT>; create(d: SeverityCreateDataT): Promise<SeverityT>; update(p: SeverityUpdateParamsT): Promise<SeverityT>; softDelete(id: SeverityDeleteParamsT): Promise<{ id: number }>; }
export interface SeverityFormValues { code: string; name: string; description: string; is_active: boolean; }
