import type { PeriodGradeSummaryT } from "../entities/period-grade-summaries.types";

export interface PeriodGradeSummaryListParamsT { page?: number; pageSize?: number; }

export interface PeriodGradeSummaryRepositoryT {
  list(params?: PeriodGradeSummaryListParamsT): Promise<PeriodGradeSummaryT[]>;
  get(id: number): Promise<PeriodGradeSummaryT>;
  create(data: Omit<PeriodGradeSummaryT, "id" | "enrollment_name" | "subject_offering_name" | "academic_period_name" | "qualitative_scale_name" | "calculated_at">): Promise<PeriodGradeSummaryT>;
  update(id: number, data: Partial<PeriodGradeSummaryT>): Promise<PeriodGradeSummaryT>;
  softDelete(id: number): Promise<PeriodGradeSummaryT>;
}
