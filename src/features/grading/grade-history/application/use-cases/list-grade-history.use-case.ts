import type { GradeChangeHistoryRepositoryT } from "../../domain/repositories/grade-history.repository";
import type { GradeChangeHistoryT } from "../../domain/entities/grade-history.types";

export const listGradeHistoryUseCase = async (
  repository: GradeChangeHistoryRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<GradeChangeHistoryT[]> => {
  return repository.list(params);
};
