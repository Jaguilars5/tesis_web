import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface QualitativeScaleSublevelT {
  id: number;
  scale: number;
  scale_name: string;
  sublevel: number;
  sublevel_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type QualitativeScaleSublevelOrderingT =
  | "scale_name"
  | "-scale_name"
  | "sublevel_name"
  | "-sublevel_name";

export interface QualitativeScaleSublevelListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: QualitativeScaleSublevelOrderingT;
  filters?: {
    scale?: number;
    sublevel?: number;
  };
}

export type QualitativeScaleSublevelCreateDataT = Omit<
  QualitativeScaleSublevelT,
  "id" | "is_active" | "scale_name" | "sublevel_name" | "created_at" | "updated_at"
>;

export type QualitativeScaleSublevelCreateParamsT = QualitativeScaleSublevelCreateDataT;

export type QualitativeScaleSublevelUpdateDataT = Partial<QualitativeScaleSublevelCreateDataT>;

export interface QualitativeScaleSublevelUpdateParamsT {
  id: number;
  data: QualitativeScaleSublevelUpdateDataT;
}

export interface QualitativeScaleSublevelGetParamsT {
  id: number;
}

export interface QualitativeScaleSublevelDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface QualitativeScaleSublevelServiceT {
  list(params?: QualitativeScaleSublevelListParamsT): Promise<QualitativeScaleSublevelT[]>;
  get(params: QualitativeScaleSublevelGetParamsT): Promise<QualitativeScaleSublevelT>;
  create(data: QualitativeScaleSublevelCreateDataT): Promise<QualitativeScaleSublevelT>;
  update(params: QualitativeScaleSublevelUpdateParamsT): Promise<QualitativeScaleSublevelT>;
  softDelete(params: QualitativeScaleSublevelDeleteParamsT): Promise<SoftDeleteResponseT>;
}

export interface QualitativeScaleSublevelFormValues {
  scale: number;
  sublevel: number;
}
