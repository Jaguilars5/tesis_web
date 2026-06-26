import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

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

export interface AttendanceStatusListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: AttendanceStatusOrderingT;
}

export interface AttendanceStatusFormValues {
  code: string;
  name: string;
  description: string;
}

export type AttendanceStatusCreateParamsT = AttendanceStatusFormValues;
export type AttendanceStatusUpdateDataT = Partial<AttendanceStatusFormValues>;
export interface AttendanceStatusUpdateParamsT {
  id: number;
  data: AttendanceStatusUpdateDataT;
}
export interface AttendanceStatusGetParamsT {
  id: number;
}
export interface AttendanceStatusDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface AttendanceStatusServiceT {
  list(params?: AttendanceStatusListParamsT): Promise<AttendanceStatusT[]>;
  get(params: AttendanceStatusGetParamsT): Promise<AttendanceStatusT>;
  create(params: AttendanceStatusCreateParamsT): Promise<AttendanceStatusT>;
  update(params: AttendanceStatusUpdateParamsT): Promise<AttendanceStatusT>;
  softDelete(params: AttendanceStatusDeleteParamsT): Promise<SoftDeleteResponseT>;
}
