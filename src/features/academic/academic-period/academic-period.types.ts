export interface AcademicPeriodT {
  id: number;
  code: string;
  name: string;
  period_type: number;
  period_type_name: string;
  start_date: string;
  end_date: string;
  year_weight: number | null;
  is_regular_period: boolean;
  school_year: number;
  school_year_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AcademicPeriodOrderingT =
  | "name"
  | "-name"
  | "start_date"
  | "-start_date"
  | "end_date"
  | "-end_date";

export interface AcademicPeriodListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: AcademicPeriodOrderingT;
}

export type AcademicPeriodCreateDataT = Omit<
  AcademicPeriodT,
  | "id"
  | "is_active"
  | "school_year_name"
  | "period_type_name"
  | "created_at"
  | "updated_at"
>;

export type AcademicPeriodCreateParamsT = AcademicPeriodCreateDataT;

export type AcademicPeriodUpdateDataT = Partial<Omit<AcademicPeriodT, "id">>;

export interface AcademicPeriodUpdateParamsT {
  id: number;
  data: AcademicPeriodUpdateDataT;
}

export type AcademicPeriodGetParamsT = number;

export type AcademicPeriodDeleteParamsT = number;

export interface AcademicPeriodServiceT {
  list(params?: AcademicPeriodListParamsT): Promise<AcademicPeriodT[]>;
  get(id: AcademicPeriodGetParamsT): Promise<AcademicPeriodT>;
  create(data: AcademicPeriodCreateDataT): Promise<AcademicPeriodT>;
  update(params: AcademicPeriodUpdateParamsT): Promise<AcademicPeriodT>;
  softDelete(id: AcademicPeriodDeleteParamsT): Promise<{ id: number }>;
}

export interface AcademicPeriodFormValues {
  code: string;
  name: string;
  period_type: number;
  start_date: string;
  end_date: string;
  year_weight: number | null;
  is_regular_period: boolean;
  school_year: number;
}
