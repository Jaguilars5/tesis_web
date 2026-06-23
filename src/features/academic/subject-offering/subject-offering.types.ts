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

export type SubjectOfferingOrderingT = "id" | "-id";

export interface SubjectOfferingListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: SubjectOfferingOrderingT;
}

export type SubjectOfferingCreateDataT = Omit<
  SubjectOfferingT,
  "id" | "school_year" | "is_active" | "school_year_name" | "section_name" | "subject_academic_config_name" | "created_at" | "updated_at"
>;

export type SubjectOfferingCreateParamsT = SubjectOfferingCreateDataT;

export type SubjectOfferingUpdateDataT = Partial<Omit<SubjectOfferingT, "id">>;

export interface SubjectOfferingUpdateParamsT {
  id: number;
  data: SubjectOfferingUpdateDataT;
}

export type SubjectOfferingGetParamsT = number;

export type SubjectOfferingDeleteParamsT = number;

export interface SubjectOfferingServiceT {
  list(params?: SubjectOfferingListParamsT): Promise<SubjectOfferingT[]>;
  get(id: SubjectOfferingGetParamsT): Promise<SubjectOfferingT>;
  create(data: SubjectOfferingCreateDataT): Promise<SubjectOfferingT>;
  update(params: SubjectOfferingUpdateParamsT): Promise<SubjectOfferingT>;
  softDelete(id: SubjectOfferingDeleteParamsT): Promise<{ id: number }>;
}

export interface SubjectOfferingFormValues {
  school_year: number;
  section: number;
  subject_academic_config: number;
  is_active: boolean;
}
