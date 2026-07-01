import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface SectionT {
  id: number;
  parallel: string;
  code: string;
  school_year: number;
  school_year_name: string;
  academic_grade: number;
  academic_grade_name: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionFormValues {
  code: string;
  parallel: string;
  school_year: number;
  academic_grade: number;
  capacity: number;
}

export type SectionOrderingT =
  | "parallel"
  | "-parallel"
  | "school_year__start_date"
  | "-school_year__start_date"
  | "academic_grade__name"
  | "-academic_grade__name";

export interface SectionListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    school_year?: number;
    academic_grade?: number;
    is_active?: boolean;
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
  confirm?: boolean;
};

export interface SectionServiceT {
  list(params?: SectionListParamsT): Promise<SectionT[]>;
  get(params: SectionGetParamsT): Promise<SectionT>;
  create(params: SectionCreateParamsT): Promise<SectionT>;
  update(params: SectionUpdateParamsT): Promise<SectionT>;
  softDelete(params: SectionDeleteParamsT): Promise<SoftDeleteResponseT>;
}
