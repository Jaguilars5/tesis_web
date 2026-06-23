export interface AcademicGradeT { id: number; code: string; name: string; academic_sublevel: number | null; academic_sublevel_name: string; is_active: boolean; created_at: string; updated_at: string; }
export type AcademicGradeOrderingT = "name" | "-name";
export interface AcademicGradeListParamsT { page?: number; pageSize?: number; search?: string; ordering?: AcademicGradeOrderingT; }
export type AcademicGradeCreateDataT = Omit<AcademicGradeT, "id" | "is_active" | "academic_sublevel_name" | "created_at" | "updated_at">;
export type AcademicGradeCreateParamsT = AcademicGradeCreateDataT;
export type AcademicGradeUpdateDataT = Partial<Omit<AcademicGradeT, "id">>;
export interface AcademicGradeUpdateParamsT { id: number; data: AcademicGradeUpdateDataT; }
export type AcademicGradeGetParamsT = number;
export type AcademicGradeDeleteParamsT = number;
export interface AcademicGradeServiceT { list(p?: AcademicGradeListParamsT): Promise<AcademicGradeT[]>; get(id: AcademicGradeGetParamsT): Promise<AcademicGradeT>; create(d: AcademicGradeCreateDataT): Promise<AcademicGradeT>; update(p: AcademicGradeUpdateParamsT): Promise<AcademicGradeT>; softDelete(id: AcademicGradeDeleteParamsT): Promise<{ id: number }>; }
export interface AcademicGradeFormValues { code: string; name: string; academic_sublevel: number | null; is_active: boolean; }
