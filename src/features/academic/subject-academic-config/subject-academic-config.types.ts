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

export type SubjectAcademicConfigOrderingT = "weekly_hours" | "-weekly_hours";

export interface SubjectAcademicConfigListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: SubjectAcademicConfigOrderingT;
}

export type SubjectAcademicConfigCreateDataT = Omit<
  SubjectAcademicConfigT,
  "id" | "is_active" | "subject_name" | "academic_grade_name" | "created_at" | "updated_at"
>;

export type SubjectAcademicConfigCreateParamsT = SubjectAcademicConfigCreateDataT;

export type SubjectAcademicConfigUpdateDataT = Partial<Omit<SubjectAcademicConfigT, "id">>;

export interface SubjectAcademicConfigUpdateParamsT {
  id: number;
  data: SubjectAcademicConfigUpdateDataT;
}

export type SubjectAcademicConfigGetParamsT = number;

export type SubjectAcademicConfigDeleteParamsT = number;

export interface SubjectAcademicConfigServiceT {
  list(params?: SubjectAcademicConfigListParamsT): Promise<SubjectAcademicConfigT[]>;
  get(id: SubjectAcademicConfigGetParamsT): Promise<SubjectAcademicConfigT>;
  create(data: SubjectAcademicConfigCreateDataT): Promise<SubjectAcademicConfigT>;
  update(params: SubjectAcademicConfigUpdateParamsT): Promise<SubjectAcademicConfigT>;
  softDelete(id: SubjectAcademicConfigDeleteParamsT): Promise<{ id: number }>;
}

export interface SubjectAcademicConfigFormValues {
  subject: number;
  academic_grade: number;
  weekly_hours: number;
  is_required: boolean;
  is_active: boolean;
}
