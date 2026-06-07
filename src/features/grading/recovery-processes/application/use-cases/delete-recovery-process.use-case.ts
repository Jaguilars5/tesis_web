import type { RecoveryProcessRepositoryT } from "../../domain/repositories/recovery-processes.repository";

export const deleteRecoveryProcessUseCase = async (
  repository: RecoveryProcessRepositoryT,
  id: number,
): Promise<void> => {
  return repository.delete(id);
};
