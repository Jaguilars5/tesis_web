import type { GradeTypeRepositoryT } from "../../domain/repositories/grade-types.repository";
import type { GradeTypeT } from "../../domain/entities/grade-types.types";

export const softDeleteGradeTypeUseCase = async (
  repository: GradeTypeRepositoryT,
  id: number,
): Promise<GradeTypeT> => {
  return repository.softDelete(id);
};
