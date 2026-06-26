import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface QualitativeScaleT {
  id: number;
  code: string;
  name: string;
  description: string;
  numeric_equivalence: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type QualitativeScaleOrderingT =
  | "code"
  | "-code"
  | "name"
  | "-name"
  | "numeric_equivalence"
  | "-numeric_equivalence";

export interface QualitativeScaleListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: QualitativeScaleOrderingT;
}

export type QualitativeScaleCreateDataT = Omit<
  QualitativeScaleT,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export type QualitativeScaleCreateParamsT = QualitativeScaleCreateDataT;

export type QualitativeScaleUpdateDataT = Partial<QualitativeScaleCreateDataT>;

export interface QualitativeScaleUpdateParamsT {
  id: number;
  data: QualitativeScaleUpdateDataT;
}

export interface QualitativeScaleGetParamsT {
  id: number;
}

export interface QualitativeScaleDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface QualitativeScaleServiceT {
  list(params?: QualitativeScaleListParamsT): Promise<QualitativeScaleT[]>;
  get(params: QualitativeScaleGetParamsT): Promise<QualitativeScaleT>;
  create(data: QualitativeScaleCreateDataT): Promise<QualitativeScaleT>;
  update(params: QualitativeScaleUpdateParamsT): Promise<QualitativeScaleT>;
  softDelete(params: QualitativeScaleDeleteParamsT): Promise<SoftDeleteResponseT>;
}

export interface QualitativeScaleFormValues {
  code: string;
  name: string;
  description: string;
  numeric_equivalence: number;
}
