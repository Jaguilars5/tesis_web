export interface PeriodGradeSummaryT {
  id: number;
  enrollment_name: string;
  subject_offering_name: string;
  academic_period_name: string;
  qualitative_scale_name: string;
  formative_avg: number;
  summative_avg: number;
  final_avg_truncated: number;
  requires_recovery: boolean;
  calculated_at: string;
  enrollment: number;
  subject_offering: number;
  academic_period: number;
  qualitative_scale?: number | null;
  promotion_status?: number | null;
}

export type PeriodGradeSummaryCreateT = Omit<
  PeriodGradeSummaryT,
  "id" | "enrollment_name" | "subject_offering_name" | "academic_period_name" | "qualitative_scale_name" | "calculated_at"
>;

export type PeriodGradeSummaryUpdateT = Partial<PeriodGradeSummaryT> & { id: number };
