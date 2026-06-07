import type { RecoveryProcessTypeRepositoryT } from "../../domain/repositories/recovery-process-types.repository";
import type { RecoveryProcessTypeT } from "../../domain/entities/recovery-process-types.types";

export const softDeleteRecoveryProcessTypeUseCase = async (
  repository: RecoveryProcessTypeRepositoryT,
  id: number,
): Promise<RecoveryProcessTypeT> => {
  return repository.softDelete(id);
};
