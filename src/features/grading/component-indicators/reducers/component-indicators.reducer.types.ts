import type { RequestStatusT } from "@shared/types/commonTypes";
import type { ComponentIndicatorT } from "../domain/entities/component-indicators.types";

export interface ComponentIndicatorsStateT {
  componentIndicators: ComponentIndicatorT[];
  status: RequestStatusT;
  error: string | null;
}
