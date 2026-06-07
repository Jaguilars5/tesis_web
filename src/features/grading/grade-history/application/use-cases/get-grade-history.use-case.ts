import type { GradeChangeHistoryRepositoryT } from "../../domain/repositories/grade-history.repository";
import type { GradeChangeHistoryT } from "../../domain/entities/grade-history.types";

export const getGradeHistoryUseCase = async (
  repository: GradeChangeHistoryRepositoryT,
  id: number,
): Promise<GradeChangeHistoryT> => {
  return repository.get(id);
};
