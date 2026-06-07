import type { RecoveryProcessTypeRepositoryT } from "../../domain/repositories/recovery-process-types.repository";
import type { RecoveryProcessTypeT } from "../../domain/entities/recovery-process-types.types";

export const createRecoveryProcessTypeUseCase = async (
  repository: RecoveryProcessTypeRepositoryT,
  data: Omit<RecoveryProcessTypeT, "id" | "is_active" | "created_at" | "updated_at">,
): Promise<RecoveryProcessTypeT> => {
  return repository.create(data);
};
