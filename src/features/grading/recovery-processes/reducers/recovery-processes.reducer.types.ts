import type { RequestStatusT } from "@shared/types/commonTypes";
import type { RecoveryProcessT } from "../domain/entities/recovery-processes.types";

export interface RecoveryProcessesStateT {
  recoveryProcesses: RecoveryProcessT[];
  status: RequestStatusT;
  error: string | null;
}
