export interface SubjectOfferingT {
  id: number;
  school_year: number;
  section: number;
  subject_academic_config: number;
  school_year_name: string;
  section_name: string;
  subject_academic_config_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectOfferingFormValues {
  school_year: number;
  section: number;
  subject_academic_config: number;
}

export type SubjectOfferingOrderingT = "id" | "-id";

export interface SubjectOfferingListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    school_year?: number;
    section?: number;
    subject_academic_config?: number;
  };
  ordering?: SubjectOfferingOrderingT;
}

export type SubjectOfferingCreateParamsT = SubjectOfferingFormValues;

export type SubjectOfferingUpdateDataT = Partial<SubjectOfferingFormValues>;

export interface SubjectOfferingUpdateParamsT {
  id: number;
  data: SubjectOfferingUpdateDataT;
}

export interface SubjectOfferingGetParamsT {
  id: number;
}

import type { SoftDeleteParamsT, SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export type SubjectOfferingDeleteParamsT = SoftDeleteParamsT;

export interface SubjectOfferingServiceT {
  list(params?: SubjectOfferingListParamsT): Promise<SubjectOfferingT[]>;
  get(params: SubjectOfferingGetParamsT): Promise<SubjectOfferingT>;
  create(params: SubjectOfferingCreateParamsT): Promise<SubjectOfferingT>;
  update(params: SubjectOfferingUpdateParamsT): Promise<SubjectOfferingT>;
  softDelete(params: SubjectOfferingDeleteParamsT): Promise<SoftDeleteResponseT>;
}
