export interface EnrollmentT { id: number; student: number; student_name: string; section: number; section_name: string; enrollment_status: string; enrollment_status_name: string; enrollment_date: string; withdrawal_date: string | null; attendance_rate: string | null; is_repeat: boolean; student_condition: string; cellphone: string; email: string; observations: string; is_active: boolean; created_at: string; updated_at: string; }
export type EnrollmentOrderingT = "student_name" | "-student_name" | "section_name" | "-section_name" | "enrollment_date" | "-enrollment_date" | "enrollment_status" | "-enrollment_status";
export interface EnrollmentListParamsT { page?: number; pageSize?: number; search?: string; ordering?: EnrollmentOrderingT; filters?: Record<string, string | number | boolean>; }
export interface EnrollmentListBySectionParamsT { section_id: number; status?: string; }
export type EnrollmentCreateDataT = Omit<EnrollmentT, "id" | "is_active" | "student_name" | "section_name" | "enrollment_status_name" | "created_at" | "updated_at">;
export type EnrollmentCreateParamsT = EnrollmentCreateDataT;
export type EnrollmentUpdateDataT = Partial<Omit<EnrollmentT, "id">>;
export interface EnrollmentUpdateParamsT { id: number; data: EnrollmentUpdateDataT; }
export type EnrollmentGetParamsT = number;
export type EnrollmentDeleteParamsT = number;
export interface EnrollmentServiceT { list(p?: EnrollmentListParamsT): Promise<EnrollmentT[]>; listBySection(p: EnrollmentListBySectionParamsT): Promise<EnrollmentT[]>; get(id: EnrollmentGetParamsT): Promise<EnrollmentT>; create(d: EnrollmentCreateDataT): Promise<EnrollmentT>; update(p: EnrollmentUpdateParamsT): Promise<EnrollmentT>; softDelete(id: EnrollmentDeleteParamsT): Promise<{ id: number }>; }
export interface EnrollmentFormValues { section: number; enrollment_status: string; is_repeat: boolean; student_condition: string; cellphone: string; email: string; observations: string; is_active: boolean; }
