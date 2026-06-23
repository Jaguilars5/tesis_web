export interface SectionT { id: number; parallel: string; school_year: number; school_year_name: string; academic_grade: number; academic_grade_name: string; is_active: boolean; created_at: string; updated_at: string; }
export type SectionOrderingT = "parallel" | "-parallel" | "school_year_name" | "-school_year_name" | "academic_grade_name" | "-academic_grade_name";
export interface SectionListParamsT { page?: number; pageSize?: number; search?: string; ordering?: SectionOrderingT; }
export type SectionCreateDataT = Omit<SectionT, "id" | "is_active" | "school_year_name" | "academic_grade_name" | "created_at" | "updated_at">;
export type SectionCreateParamsT = SectionCreateDataT;
export type SectionUpdateDataT = Partial<Omit<SectionT, "id">>;
export interface SectionUpdateParamsT { id: number; data: SectionUpdateDataT; }
export type SectionGetParamsT = number;
export type SectionDeleteParamsT = number;
export interface SectionServiceT { list(p?: SectionListParamsT): Promise<SectionT[]>; get(id: SectionGetParamsT): Promise<SectionT>; create(d: SectionCreateDataT): Promise<SectionT>; update(p: SectionUpdateParamsT): Promise<SectionT>; softDelete(id: SectionDeleteParamsT): Promise<{ id: number }>; }
export interface SectionFormValues { parallel: string; school_year: number; academic_grade: number; is_active: boolean; }
