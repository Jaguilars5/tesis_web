import type { RecoveryProcessRepositoryT } from "../../domain/repositories/recovery-processes.repository";
import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";

export const createRecoveryProcessUseCase = async (
  repository: RecoveryProcessRepositoryT,
  data: Omit<RecoveryProcessT, "id" | "period_grade_summary_name" | "managed_by_user_name">,
): Promise<RecoveryProcessT> => {
  return repository.create(data);
};
