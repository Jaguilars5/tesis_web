export interface AttendanceStatusT {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AttendanceStatusOrderingT = "name" | "-name" | "code" | "-code";
export interface AttendanceStatusListParamsT { page?: number; pageSize?: number; search?: string; ordering?: AttendanceStatusOrderingT; }
export type AttendanceStatusCreateDataT = Omit<AttendanceStatusT, "id" | "is_active" | "created_at" | "updated_at">;
export type AttendanceStatusCreateParamsT = AttendanceStatusCreateDataT;
export type AttendanceStatusUpdateDataT = Partial<Omit<AttendanceStatusT, "id">>;
export interface AttendanceStatusUpdateParamsT { id: number; data: AttendanceStatusUpdateDataT; }
export type AttendanceStatusGetParamsT = number;
export type AttendanceStatusDeleteParamsT = number;

export interface AttendanceStatusServiceT {
  list(params?: AttendanceStatusListParamsT): Promise<AttendanceStatusT[]>;
  get(id: AttendanceStatusGetParamsT): Promise<AttendanceStatusT>;
  create(data: AttendanceStatusCreateDataT): Promise<AttendanceStatusT>;
  update(params: AttendanceStatusUpdateParamsT): Promise<AttendanceStatusT>;
  delete(id: AttendanceStatusDeleteParamsT): Promise<{ id: number }>;
}

export interface AttendanceStatusFormValues { code: string; name: string; description: string; is_active: boolean; }
