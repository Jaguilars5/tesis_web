import type { QualitativeScaleRepositoryT } from "../../domain/repositories/qualitative-scales.repository";
import type { QualitativeScaleT } from "../../domain/entities/qualitative-scales.types";

export const listQualitativeScalesUseCase = async (
  repository: QualitativeScaleRepositoryT,
  params?: { page?: number; pageSize?: number },
): Promise<QualitativeScaleT[]> => {
  return repository.list(params);
};
