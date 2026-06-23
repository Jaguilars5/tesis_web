export interface EvaluationBlockT { id: number; code: string; academic_period: number; academic_period_name: string; name: string; tipo: string | null; weight_percentage: number; is_active: boolean; created_at: string; updated_at: string; }
export type EvaluationBlockOrderingT = "name" | "-name" | "code" | "-code" | "weight_percentage" | "-weight_percentage" | "academic_period_name" | "-academic_period_name";
export interface EvaluationBlockListParamsT { page?: number; pageSize?: number; search?: string; ordering?: EvaluationBlockOrderingT; }
export type EvaluationBlockCreateDataT = Omit<EvaluationBlockT, "id" | "is_active" | "academic_period_name" | "created_at" | "updated_at">;
export type EvaluationBlockCreateParamsT = EvaluationBlockCreateDataT;
export type EvaluationBlockUpdateDataT = Partial<Omit<EvaluationBlockT, "id">>;
export interface EvaluationBlockUpdateParamsT { id: number; data: EvaluationBlockUpdateDataT; }
export type EvaluationBlockGetParamsT = number;
export type EvaluationBlockDeleteParamsT = number;
export interface EvaluationBlockServiceT { list(p?: EvaluationBlockListParamsT): Promise<EvaluationBlockT[]>; get(id: EvaluationBlockGetParamsT): Promise<EvaluationBlockT>; create(d: EvaluationBlockCreateDataT): Promise<EvaluationBlockT>; update(p: EvaluationBlockUpdateParamsT): Promise<EvaluationBlockT>; softDelete(id: EvaluationBlockDeleteParamsT): Promise<{ id: number }>; }
export interface EvaluationBlockFormValues { code: string; name: string; weight_percentage: number; academic_period: number; tipo: string | null; is_active: boolean; }
