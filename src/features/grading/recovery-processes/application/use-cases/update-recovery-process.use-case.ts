import type { RecoveryProcessRepositoryT } from "../../domain/repositories/recovery-processes.repository";
import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";

export const updateRecoveryProcessUseCase = async (
  repository: RecoveryProcessRepositoryT,
  id: number,
  data: Partial<RecoveryProcessT>,
): Promise<RecoveryProcessT> => {
  return repository.update(id, data);
};
