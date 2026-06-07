import type { RequestStatusT } from "@shared/types/commonTypes";
import type { EvaluationBlockT } from "../domain/entities/evaluation-block.types";

export interface EvaluationBlocksStateT {
  evaluationBlocks: EvaluationBlockT[];
  status: RequestStatusT;
  error: string | null;
}
