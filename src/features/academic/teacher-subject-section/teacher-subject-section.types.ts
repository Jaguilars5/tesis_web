export interface TeacherSubjectSectionT {
  id: number;
  user: number;
  user_name: string;
  subject_offering: number;
  subject_offering_name: string;
  subject_offering_school_year: number | null;
  subject_offering_school_year_name: string | null;
  subject_offering_section: number | null;
  subject_offering_section_name: string | null;
  subject_offering_academic_grade: number | null;
  subject_offering_academic_grade_name: string | null;
  subject_offering_subject: number | null;
  subject_offering_subject_name: string | null;
  subject_offering_config: number | null;
  subject_offering_config_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type TeacherSubjectSectionOrderingT =
  | "id"
  | "-id"
  | "created_at"
  | "-created_at"
  | "is_active"
  | "-is_active";

export type TeacherSubjectSectionFiltersT = {
  academic_grade?: number;
  school_year?: number;
  section?: number;
  subject?: number;
  user?: number;
  is_active?: boolean;
};

export interface TeacherSubjectSectionListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: TeacherSubjectSectionOrderingT;
  filters?: TeacherSubjectSectionFiltersT;
}

export type TeacherSubjectSectionCreateDataT = Omit<
  TeacherSubjectSectionT,
  | "id"
  | "is_active"
  | "user_name"
  | "subject_offering_name"
  | "subject_offering_school_year"
  | "subject_offering_school_year_name"
  | "subject_offering_section"
  | "subject_offering_section_name"
  | "subject_offering_academic_grade"
  | "subject_offering_academic_grade_name"
  | "subject_offering_subject"
  | "subject_offering_subject_name"
  | "subject_offering_config"
  | "subject_offering_config_name"
  | "created_at"
  | "updated_at"
>;

export type TeacherSubjectSectionCreateParamsT = TeacherSubjectSectionCreateDataT;

export type TeacherSubjectSectionUpdateDataT = Partial<Omit<TeacherSubjectSectionT, "id">>;

export interface TeacherSubjectSectionUpdateParamsT {
  id: number;
  data: TeacherSubjectSectionUpdateDataT;
}

import type { PaginatedResult } from "@shared/types/api.response.types";
import type { SoftDeleteParamsT, SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface TeacherSubjectSectionGetParamsT {
  id: number;
}

export type TeacherSubjectSectionDeleteParamsT = SoftDeleteParamsT;

export interface TeacherSubjectSectionServiceT {
  list(params?: TeacherSubjectSectionListParamsT): Promise<PaginatedResult<TeacherSubjectSectionT>>;
  get(params: TeacherSubjectSectionGetParamsT): Promise<TeacherSubjectSectionT>;
  create(data: TeacherSubjectSectionCreateDataT): Promise<TeacherSubjectSectionT>;
  update(params: TeacherSubjectSectionUpdateParamsT): Promise<TeacherSubjectSectionT>;
  softDelete(params: TeacherSubjectSectionDeleteParamsT): Promise<SoftDeleteResponseT>;
}

export interface TeacherSubjectSectionFormValues {
  user: number;
  subject_offering: number;
  is_active: boolean;
}
