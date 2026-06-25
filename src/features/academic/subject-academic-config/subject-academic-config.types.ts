export interface SubjectAcademicConfigT {
  id: number;
  subject: number;
  academic_grade: number;
  subject_name: string;
  academic_grade_name: string;
  weekly_hours: number;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectAcademicConfigFormValues {
  subject: number;
  academic_grade: number;
  weekly_hours: number;
  is_required: boolean;
}

export type SubjectAcademicConfigOrderingT = "weekly_hours" | "-weekly_hours";

export interface SubjectAcademicConfigListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    subject?: number;
    academic_grade?: number;
  };
  ordering?: SubjectAcademicConfigOrderingT;
}

export type SubjectAcademicConfigCreateParamsT = SubjectAcademicConfigFormValues;

export type SubjectAcademicConfigUpdateDataT =
  Partial<SubjectAcademicConfigFormValues>;

export interface SubjectAcademicConfigUpdateParamsT {
  id: number;
  data: SubjectAcademicConfigUpdateDataT;
}

export interface SubjectAcademicConfigGetParamsT {
  id: number;
}

import type { SoftDeleteParamsT, SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export type SubjectAcademicConfigDeleteParamsT = SoftDeleteParamsT;

export interface SubjectAcademicConfigServiceT {
  list(
    params?: SubjectAcademicConfigListParamsT,
  ): Promise<SubjectAcademicConfigT[]>;
  get(params: SubjectAcademicConfigGetParamsT): Promise<SubjectAcademicConfigT>;
  create(
    params: SubjectAcademicConfigCreateParamsT,
  ): Promise<SubjectAcademicConfigT>;
  update(
    params: SubjectAcademicConfigUpdateParamsT,
  ): Promise<SubjectAcademicConfigT>;
  softDelete(
    params: SubjectAcademicConfigDeleteParamsT,
  ): Promise<SoftDeleteResponseT>;
}
