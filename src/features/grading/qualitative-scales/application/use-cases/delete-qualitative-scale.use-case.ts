import type { QualitativeScaleRepositoryT } from "../../domain/repositories/qualitative-scales.repository";

export const deleteQualitativeScaleUseCase = async (
  repository: QualitativeScaleRepositoryT,
  id: number,
): Promise<void> => {
  return repository.delete(id);
};
