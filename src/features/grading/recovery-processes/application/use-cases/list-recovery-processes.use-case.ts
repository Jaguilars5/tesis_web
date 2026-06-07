import type { RecoveryProcessRepositoryT } from "../../domain/repositories/recovery-processes.repository";
import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";

export const listRecoveryProcessesUseCase = async (
  repository: RecoveryProcessRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<RecoveryProcessT[]> => {
  return repository.list(params);
};
