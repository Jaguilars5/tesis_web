import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface PeriodGradeSummaryT {
  id: number;
  enrollment: number;
  enrollment_name: string;
  subject_offering: number;
  subject_offering_name: string;
  academic_period: number;
  academic_period_name: string;
  formative_avg: number;
  summative_avg: number;
  final_avg_truncated: number;
  qualitative_scale: number | null;
  qualitative_scale_name: string;
  requires_recovery: boolean;
  promotion_status: string;
  calculated_at: string;
  created_at: string;
  updated_at: string;
}

export type PeriodGradeSummaryOrderingT =
  | "enrollment_name"
  | "-enrollment_name"
  | "subject_offering_name"
  | "-subject_offering_name"
  | "academic_period_name"
  | "-academic_period_name"
  | "final_avg_truncated"
  | "-final_avg_truncated";

export interface PeriodGradeSummaryListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: PeriodGradeSummaryOrderingT;
  filters?: Record<string, string | number | boolean>;
}

export type PeriodGradeSummaryCreateDataT = Omit<
  PeriodGradeSummaryT,
  "id" | "enrollment_name" | "subject_offering_name" | "academic_period_name" | "qualitative_scale_name" | "calculated_at" | "created_at" | "updated_at"
>;

export type PeriodGradeSummaryCreateParamsT = PeriodGradeSummaryCreateDataT;

export type PeriodGradeSummaryUpdateDataT = Partial<
  Omit<PeriodGradeSummaryT, "id">
>;

export interface PeriodGradeSummaryUpdateParamsT {
  id: number;
  data: PeriodGradeSummaryUpdateDataT;
}

export interface PeriodGradeSummaryGetParamsT {
  id: number;
}

export interface PeriodGradeSummaryDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface PeriodGradeSummaryServiceT {
  list(params?: PeriodGradeSummaryListParamsT): Promise<PeriodGradeSummaryT[]>;
  get(params: PeriodGradeSummaryGetParamsT): Promise<PeriodGradeSummaryT>;
  create(data: PeriodGradeSummaryCreateDataT): Promise<PeriodGradeSummaryT>;
  update(params: PeriodGradeSummaryUpdateParamsT): Promise<PeriodGradeSummaryT>;
  softDelete(params: PeriodGradeSummaryDeleteParamsT): Promise<SoftDeleteResponseT>;
}

export interface PeriodGradeSummaryFormValues {
  formative_avg: number;
  summative_avg: number;
  final_avg_truncated: number;
  requires_recovery: boolean;
  enrollment: number;
  subject_offering: number;
  academic_period: number;
  qualitative_scale: number | null;
  promotion_status: string;
}
