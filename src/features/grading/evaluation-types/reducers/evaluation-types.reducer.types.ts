import type { RequestStatusT } from "@shared/types/commonTypes";
import type { EvaluationTypeT } from "../domain/entities/evaluation-types.types";

export interface EvaluationTypesStateT {
  evaluationTypes: EvaluationTypeT[];
  status: RequestStatusT;
  error: string | null;
}
