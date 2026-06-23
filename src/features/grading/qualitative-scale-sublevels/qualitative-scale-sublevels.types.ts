export interface QualitativeScaleSublevelT { id: number; scale: number; scale_name: string; sublevel: number; sublevel_name: string; is_active: boolean; created_at: string; updated_at: string; }
export type QualitativeScaleSublevelOrderingT = "scale_name" | "-scale_name" | "sublevel_name" | "-sublevel_name";
export interface QualitativeScaleSublevelListParamsT { page?: number; pageSize?: number; search?: string; ordering?: QualitativeScaleSublevelOrderingT; }
export type QualitativeScaleSublevelCreateDataT = Omit<QualitativeScaleSublevelT, "id" | "is_active" | "scale_name" | "sublevel_name" | "created_at" | "updated_at">;
export type QualitativeScaleSublevelCreateParamsT = QualitativeScaleSublevelCreateDataT;
export type QualitativeScaleSublevelUpdateDataT = Partial<Omit<QualitativeScaleSublevelT, "id">>;
export interface QualitativeScaleSublevelUpdateParamsT { id: number; data: QualitativeScaleSublevelUpdateDataT; }
export type QualitativeScaleSublevelGetParamsT = number;
export type QualitativeScaleSublevelDeleteParamsT = number;
export interface QualitativeScaleSublevelServiceT { list(p?: QualitativeScaleSublevelListParamsT): Promise<QualitativeScaleSublevelT[]>; get(id: QualitativeScaleSublevelGetParamsT): Promise<QualitativeScaleSublevelT>; create(d: QualitativeScaleSublevelCreateDataT): Promise<QualitativeScaleSublevelT>; update(p: QualitativeScaleSublevelUpdateParamsT): Promise<QualitativeScaleSublevelT>; softDelete(id: QualitativeScaleSublevelDeleteParamsT): Promise<QualitativeScaleSublevelT>; }
export interface QualitativeScaleSublevelFormValues { scale: number; sublevel: number; is_active: boolean; }
