import type { QualitativeScaleRepositoryT } from "../../domain/repositories/qualitative-scales.repository";
import type { QualitativeScaleT } from "../../domain/entities/qualitative-scales.types";

export const updateQualitativeScaleUseCase = async (
  repository: QualitativeScaleRepositoryT,
  id: number,
  data: Partial<QualitativeScaleT>,
): Promise<QualitativeScaleT> => {
  return repository.update(id, data);
};
