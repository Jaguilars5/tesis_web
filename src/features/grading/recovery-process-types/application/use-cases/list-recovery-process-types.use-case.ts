import type { RecoveryProcessTypeRepositoryT } from "../../domain/repositories/recovery-process-types.repository";
import type { RecoveryProcessTypeT } from "../../domain/entities/recovery-process-types.types";

export const listRecoveryProcessTypesUseCase = async (
  repository: RecoveryProcessTypeRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<RecoveryProcessTypeT[]> => {
  return repository.list(params);
};
