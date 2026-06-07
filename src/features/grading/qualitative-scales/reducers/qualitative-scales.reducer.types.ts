import type { RequestStatusT } from "@shared/types/commonTypes";
import type { QualitativeScaleT } from "../domain/entities/qualitative-scales.types";

export interface QualitativeScalesStateT {
  qualitativeScales: QualitativeScaleT[];
  status: RequestStatusT;
  error: string | null;
}
