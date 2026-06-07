import type { RecoveryProcessTypeRepositoryT } from "../../domain/repositories/recovery-process-types.repository";
import type { RecoveryProcessTypeT } from "../../domain/entities/recovery-process-types.types";

export const updateRecoveryProcessTypeUseCase = async (
  repository: RecoveryProcessTypeRepositoryT,
  id: number,
  data: Partial<RecoveryProcessTypeT>,
): Promise<RecoveryProcessTypeT> => {
  return repository.update(id, data);
};
