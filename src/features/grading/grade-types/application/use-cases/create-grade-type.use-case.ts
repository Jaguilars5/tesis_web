import type { GradeTypeRepositoryT } from "../../domain/repositories/grade-types.repository";
import type { GradeTypeT } from "../../domain/entities/grade-types.types";

export const createGradeTypeUseCase = async (
  repository: GradeTypeRepositoryT,
  data: Omit<GradeTypeT, "id" | "is_active" | "created_at" | "updated_at">,
): Promise<GradeTypeT> => {
  return repository.create(data);
};
