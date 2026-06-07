import type { QualitativeScaleRepositoryT } from "../../domain/repositories/qualitative-scales.repository";
import type { QualitativeScaleT } from "../../domain/entities/qualitative-scales.types";

export const createQualitativeScaleUseCase = async (
  repository: QualitativeScaleRepositoryT,
  data: Omit<QualitativeScaleT, "id">,
): Promise<QualitativeScaleT> => {
  return repository.create(data);
};
