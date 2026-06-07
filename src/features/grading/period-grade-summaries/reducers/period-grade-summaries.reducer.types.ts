import type { RequestStatusT } from "@shared/types/commonTypes";
import type { PeriodGradeSummaryT } from "../domain/entities/period-grade-summaries.types";

export interface PeriodGradeSummariesStateT {
  periodGradeSummaries: PeriodGradeSummaryT[];
  status: RequestStatusT;
  error: string | null;
}
