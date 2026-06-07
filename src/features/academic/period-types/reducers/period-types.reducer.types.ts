import type { RequestStatusT } from "@shared/types/commonTypes";
import type { PeriodTypeT } from "../domain/entities/period-types.types";

export interface PeriodTypeStateT {
  periodTypes: PeriodTypeT[];
  status: RequestStatusT;
  error: string | null;
}
