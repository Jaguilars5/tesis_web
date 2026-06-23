export interface QualitativeScaleT { id: number; code: string; name: string; description: string; numeric_equivalence: number; is_active: boolean; created_at: string; updated_at: string; }
export type QualitativeScaleOrderingT = "code" | "-code" | "name" | "-name" | "numeric_equivalence" | "-numeric_equivalence";
export interface QualitativeScaleListParamsT { page?: number; pageSize?: number; search?: string; ordering?: QualitativeScaleOrderingT; }
export type QualitativeScaleCreateDataT = Omit<QualitativeScaleT, "id" | "is_active" | "created_at" | "updated_at">;
export type QualitativeScaleCreateParamsT = QualitativeScaleCreateDataT;
export type QualitativeScaleUpdateDataT = Partial<Omit<QualitativeScaleT, "id">>;
export interface QualitativeScaleUpdateParamsT { id: number; data: QualitativeScaleUpdateDataT; }
export type QualitativeScaleGetParamsT = number;
export type QualitativeScaleDeleteParamsT = number;
export interface QualitativeScaleServiceT { list(p?: QualitativeScaleListParamsT): Promise<QualitativeScaleT[]>; get(id: QualitativeScaleGetParamsT): Promise<QualitativeScaleT>; create(d: QualitativeScaleCreateDataT): Promise<QualitativeScaleT>; update(p: QualitativeScaleUpdateParamsT): Promise<QualitativeScaleT>; softDelete(id: QualitativeScaleDeleteParamsT): Promise<{ id: number }>; }
export interface QualitativeScaleFormValues { code: string; name: string; description: string; numeric_equivalence: number; is_active: boolean; }
