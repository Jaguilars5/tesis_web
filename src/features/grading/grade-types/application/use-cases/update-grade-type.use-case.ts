import type { GradeTypeRepositoryT } from "../../domain/repositories/grade-types.repository";
import type { GradeTypeT } from "../../domain/entities/grade-types.types";

export const updateGradeTypeUseCase = async (
  repository: GradeTypeRepositoryT,
  id: number,
  data: Partial<GradeTypeT>,
): Promise<GradeTypeT> => {
  return repository.update(id, data);
};
