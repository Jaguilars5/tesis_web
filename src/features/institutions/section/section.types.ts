export interface SectionT {
  id: number;
  parallel: string;
  school_year: number;
  school_year_name: string;
  academic_grade: number;
  academic_grade_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionFormValues {
  parallel: string;
  school_year: number;
  academic_grade: number;
}

export type SectionOrderingT =
  | "parallel"
  | "-parallel"
  | "school_year_name"
  | "-school_year_name"
  | "academic_grade_name"
  | "-academic_grade_name";

export interface SectionListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    school_year?: number;
    academic_grade?: number;
  };
  ordering?: SectionOrderingT;
}

export type SectionCreateParamsT = SectionFormValues;

export type SectionUpdateDataT = Partial<SectionFormValues>;

export interface SectionUpdateParamsT {
  id: number;
  data: SectionUpdateDataT;
}

export type SectionGetParamsT = {
  id: number;
};

export type SectionDeleteParamsT = {
  id: number;
};

export interface SectionServiceT {
  list(params?: SectionListParamsT): Promise<SectionT[]>;
  get(params: SectionGetParamsT): Promise<SectionT>;
  create(params: SectionCreateParamsT): Promise<SectionT>;
  update(params: SectionUpdateParamsT): Promise<SectionT>;
  softDelete(params: SectionDeleteParamsT): Promise<{ id: number }>;
}
