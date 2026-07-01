import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface AcademicGradeT {
  id: number;
  code: string;
  name: string;
  academic_sublevel: number;
  academic_sublevel_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicGradeFormValues {
  code: string;
  name: string;
  academic_sublevel: number;
}

export type AcademicGradeOrderingT = "name" | "-name";

export interface AcademicGradeListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    academic_sublevel?: number;
    is_active?: boolean;
  };
  ordering?: AcademicGradeOrderingT;
}

export type AcademicGradeCreateParamsT = AcademicGradeFormValues;

export type AcademicGradeUpdateDataT = Partial<AcademicGradeFormValues>;

export interface AcademicGradeUpdateParamsT {
  id: number;
  data: AcademicGradeUpdateDataT;
}

export type AcademicGradeGetParamsT = {
  id: number;
};

export type AcademicGradeDeleteParamsT = {
  id: number;
  confirm?: boolean;
};

export interface AcademicGradeServiceT {
  list(params?: AcademicGradeListParamsT): Promise<AcademicGradeT[]>;
  get(params: AcademicGradeGetParamsT): Promise<AcademicGradeT>;
  create(params: AcademicGradeCreateParamsT): Promise<AcademicGradeT>;
  update(params: AcademicGradeUpdateParamsT): Promise<AcademicGradeT>;
  softDelete(params: AcademicGradeDeleteParamsT): Promise<SoftDeleteResponseT>;
}
