import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface AcademicLevelT {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicLevelFormValues {
  code: string;
  name: string;
  description: string;
}

export type AcademicLevelOrderingT = "name" | "-name" | "code" | "-code";

export interface AcademicLevelListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: AcademicLevelOrderingT;
  filters?: {
    is_active?: boolean;
  };
}

export type AcademicLevelCreateParamsT = AcademicLevelFormValues;

export interface AcademicLevelUpdateParamsT {
  id: number;
  data: Partial<AcademicLevelFormValues>;
}

export interface AcademicLevelGetParamsT {
  id: number;
}
export interface AcademicLevelDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface AcademicLevelServiceT {
  list(params?: AcademicLevelListParamsT): Promise<AcademicLevelT[]>;
  get(params: AcademicLevelGetParamsT): Promise<AcademicLevelT>;
  create(params: AcademicLevelCreateParamsT): Promise<AcademicLevelT>;
  update(params: AcademicLevelUpdateParamsT): Promise<AcademicLevelT>;
  softDelete(params: AcademicLevelDeleteParamsT): Promise<SoftDeleteResponseT>;
}
