export interface AcademicSubLevelT { id: number; code: string; name: string; description: string; academic_level: number; academic_level_name: string; is_active: boolean; created_at: string; updated_at: string; }
export type AcademicSubLevelOrderingT = "name" | "-name" | "code" | "-code";
export interface AcademicSubLevelListParamsT { page?: number; pageSize?: number; search?: string; ordering?: AcademicSubLevelOrderingT; }
export type AcademicSubLevelCreateDataT = Omit<AcademicSubLevelT, "id" | "is_active" | "academic_level_name" | "created_at" | "updated_at">;
export type AcademicSubLevelCreateParamsT = AcademicSubLevelCreateDataT;
export type AcademicSubLevelUpdateDataT = Partial<Omit<AcademicSubLevelT, "id">>;
export interface AcademicSubLevelUpdateParamsT { id: number; data: AcademicSubLevelUpdateDataT; }
export type AcademicSubLevelGetParamsT = number;
export type AcademicSubLevelDeleteParamsT = number;
export interface AcademicSubLevelServiceT { list(p?: AcademicSubLevelListParamsT): Promise<AcademicSubLevelT[]>; get(id: AcademicSubLevelGetParamsT): Promise<AcademicSubLevelT>; create(d: AcademicSubLevelCreateDataT): Promise<AcademicSubLevelT>; update(p: AcademicSubLevelUpdateParamsT): Promise<AcademicSubLevelT>; softDelete(id: AcademicSubLevelDeleteParamsT): Promise<{ id: number }>; }
export interface AcademicSubLevelFormValues { code: string; name: string; description: string; academic_level: number; is_active: boolean; }
