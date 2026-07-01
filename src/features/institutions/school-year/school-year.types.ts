import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface SchoolYearT {
  id: number;
  name?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolYearFormValuesT {
  start_date: string;
  end_date: string;
}

export type SchoolYearOrderingT =
  | "start_date"
  | "-start_date"
  | "end_date"
  | "-end_date";

export interface SchoolYearListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: SchoolYearOrderingT;
  filters?: {
    is_active?: boolean;
  };
}

export type SchoolYearCreateParamsT = SchoolYearFormValuesT;

export interface SchoolYearUpdateParamsT {
  id: number;
  data: Partial<SchoolYearFormValuesT>;
}

export interface SchoolYearGetParamsT {
  id: number;
}
export interface SchoolYearDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface SchoolYearServiceT {
  list(params?: SchoolYearListParamsT): Promise<SchoolYearT[]>;
  get(params: SchoolYearGetParamsT): Promise<SchoolYearT>;
  create(params: SchoolYearCreateParamsT): Promise<SchoolYearT>;
  update(params: SchoolYearUpdateParamsT): Promise<SchoolYearT>;
  softDelete(params: SchoolYearDeleteParamsT): Promise<SoftDeleteResponseT>;
}
