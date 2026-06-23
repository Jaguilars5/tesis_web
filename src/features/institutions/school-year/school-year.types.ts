export interface SchoolYearT { id: number; name: string; start_date: string; end_date: string; is_active: boolean; created_at: string; updated_at: string; }
export type SchoolYearOrderingT = "name" | "-name";
export interface SchoolYearListParamsT { page?: number; pageSize?: number; search?: string; ordering?: SchoolYearOrderingT; }
export type SchoolYearCreateDataT = Omit<SchoolYearT, "id" | "is_active" | "created_at" | "updated_at">;
export type SchoolYearCreateParamsT = SchoolYearCreateDataT;
export type SchoolYearUpdateDataT = Partial<Omit<SchoolYearT, "id">>;
export interface SchoolYearUpdateParamsT { id: number; data: SchoolYearUpdateDataT; }
export type SchoolYearGetParamsT = number;
export type SchoolYearDeleteParamsT = number;
export interface SchoolYearServiceT { list(p?: SchoolYearListParamsT): Promise<SchoolYearT[]>; get(id: SchoolYearGetParamsT): Promise<SchoolYearT>; create(d: SchoolYearCreateDataT): Promise<SchoolYearT>; update(p: SchoolYearUpdateParamsT): Promise<SchoolYearT>; softDelete(id: SchoolYearDeleteParamsT): Promise<{ id: number }>; }
export interface SchoolYearFormValues { name: string; start_date: string; end_date: string; is_active: boolean; }
