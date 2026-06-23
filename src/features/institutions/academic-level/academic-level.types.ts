export interface AcademicLevelT { id: number; code: string; name: string; description: string; is_active: boolean; created_at: string; updated_at: string; }
export type AcademicLevelOrderingT = "name" | "-name" | "code" | "-code";
export interface AcademicLevelListParamsT { page?: number; pageSize?: number; search?: string; ordering?: AcademicLevelOrderingT; }
export type AcademicLevelCreateDataT = Omit<AcademicLevelT, "id" | "is_active" | "created_at" | "updated_at">;
export type AcademicLevelCreateParamsT = AcademicLevelCreateDataT;
export type AcademicLevelUpdateDataT = Partial<Omit<AcademicLevelT, "id">>;
export interface AcademicLevelUpdateParamsT { id: number; data: AcademicLevelUpdateDataT; }
export type AcademicLevelGetParamsT = number;
export type AcademicLevelDeleteParamsT = number;
export interface AcademicLevelServiceT { list(p?: AcademicLevelListParamsT): Promise<AcademicLevelT[]>; get(id: AcademicLevelGetParamsT): Promise<AcademicLevelT>; create(d: AcademicLevelCreateDataT): Promise<AcademicLevelT>; update(p: AcademicLevelUpdateParamsT): Promise<AcademicLevelT>; softDelete(id: AcademicLevelDeleteParamsT): Promise<{ id: number }>; }
export interface AcademicLevelFormValues { code: string; name: string; description: string; is_active: boolean; }
