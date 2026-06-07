import type { RequestStatusT } from "@shared/types/commonTypes";
import type { SectionT } from "../domain/entities/section.types";

export interface SectionStateT {
  sections: SectionT[];
  status: RequestStatusT;
  error: string | null;
}
