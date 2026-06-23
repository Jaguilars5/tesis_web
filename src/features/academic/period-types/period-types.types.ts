export interface PeriodTypeT {
  id: number;
  code: string;
  name: string;
  description: string;
  divisions_per_year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PeriodTypeOrderingT = "name" | "-name" | "code" | "-code";

export interface PeriodTypeListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: PeriodTypeOrderingT;
}

export type PeriodTypeCreateDataT = Omit<
  PeriodTypeT,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export type PeriodTypeCreateParamsT = PeriodTypeCreateDataT;

export type PeriodTypeUpdateDataT = Partial<Omit<PeriodTypeT, "id">>;

export interface PeriodTypeUpdateParamsT {
  id: number;
  data: PeriodTypeUpdateDataT;
}

export type PeriodTypeGetParamsT = number;

export type PeriodTypeDeleteParamsT = number;

export interface PeriodTypeServiceT {
  list(params?: PeriodTypeListParamsT): Promise<PeriodTypeT[]>;
  get(id: PeriodTypeGetParamsT): Promise<PeriodTypeT>;
  create(data: PeriodTypeCreateDataT): Promise<PeriodTypeT>;
  update(params: PeriodTypeUpdateParamsT): Promise<PeriodTypeT>;
  softDelete(id: PeriodTypeDeleteParamsT): Promise<{ id: number }>;
}

export interface PeriodTypeFormValues {
  code: string;
  name: string;
  description: string;
  divisions_per_year: number;
  is_active: boolean;
}
