import type { GradeTypeRepositoryT } from "../../domain/repositories/grade-types.repository";
import type { GradeTypeT } from "../../domain/entities/grade-types.types";

export const listGradeTypesUseCase = async (
  repository: GradeTypeRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<GradeTypeT[]> => {
  return repository.list(params);
};
