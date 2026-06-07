import type { QualitativeScaleT } from "../entities/qualitative-scales.types";
export interface QualitativeScaleListParamsT { page?: number; pageSize?: number; }
export interface QualitativeScaleRepositoryT {
  list(params?: QualitativeScaleListParamsT): Promise<QualitativeScaleT[]>;
  get(id: number): Promise<QualitativeScaleT>;
  create(data: Omit<QualitativeScaleT, "id">): Promise<QualitativeScaleT>;
  update(id: number, data: Partial<QualitativeScaleT>): Promise<QualitativeScaleT>;
  delete(id: number): Promise<void>;
}
