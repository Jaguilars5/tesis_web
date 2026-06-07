import type { RequestStatusT } from "@shared/types/commonTypes";
import type { RecoveryProcessTypeT } from "../domain/entities/recovery-process-types.types";

export interface RecoveryProcessTypesStateT {
  recoveryProcessTypes: RecoveryProcessTypeT[];
  status: RequestStatusT;
  error: string | null;
}
