export interface AcademicSubLevelT {
  id: number;
  code: string;
  name: string;
  description: string;
  academic_level: number;
  academic_level_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicSubLevelFormValues {
  code: string;
  name: string;
  description: string;
  academic_level: number;
}

export type AcademicSubLevelOrderingT = "name" | "-name" | "code" | "-code";

export interface AcademicSubLevelListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    academic_level?: number;
  };
  ordering?: AcademicSubLevelOrderingT;
}

export type AcademicSubLevelCreateParamsT = AcademicSubLevelFormValues;

export type AcademicSubLevelUpdateDataT = Partial<AcademicSubLevelFormValues>;

export interface AcademicSubLevelUpdateParamsT {
  id: number;
  data: AcademicSubLevelUpdateDataT;
}

export interface AcademicSubLevelGetParamsT {
  id: number;
}

export interface AcademicSubLevelDeleteParamsT {
  id: number;
}

export interface AcademicSubLevelServiceT {
  list(params?: AcademicSubLevelListParamsT): Promise<AcademicSubLevelT[]>;
  get(params: AcademicSubLevelGetParamsT): Promise<AcademicSubLevelT>;
  create(params: AcademicSubLevelCreateParamsT): Promise<AcademicSubLevelT>;
  update(params: AcademicSubLevelUpdateParamsT): Promise<AcademicSubLevelT>;
  softDelete(params: AcademicSubLevelDeleteParamsT): Promise<{ id: number }>;
}
