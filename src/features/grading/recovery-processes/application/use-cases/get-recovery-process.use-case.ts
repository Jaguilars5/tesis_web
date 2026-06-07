import type { RecoveryProcessRepositoryT } from "../../domain/repositories/recovery-processes.repository";
import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";

export const getRecoveryProcessUseCase = async (
  repository: RecoveryProcessRepositoryT,
  id: number,
): Promise<RecoveryProcessT> => {
  return repository.get(id);
};
