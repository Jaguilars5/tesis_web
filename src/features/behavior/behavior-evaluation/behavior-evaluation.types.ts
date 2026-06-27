// Used in getRelatedIncidents
export interface RelatedConductIncidentT {
  id: number; incident_type: number; incident_type_name: string; severity: number; severity_name: string;
  academic_period: number; academic_period_name: string; enrollment: number; enrollment_name: string;
  incident_date: string; description: string; actions_taken: string; family_notified: boolean;
  uuid: string; sync_version: number; created_at: string; updated_at: string;
}

export interface BehaviorEvaluationT {
  id: number;
  enrollment: number;
  enrollment_name: string;
  academic_period: number;
  academic_period_name: string;
  evaluated_by: number | null;
  approved_by: number | null;
  created_by: number | null;
  calculated_scale: number;
  calculated_scale_name: string;
  final_scale: number | null;
  final_scale_name: string | null;
  general_observation: string;
  override_reason: string;
  evaluation_date: string;
  approval_date: string | null;
  uuid: string;
  sync_status: string | null;
  sync_version: number;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BehaviorEvaluationOrderingT =
  | "id"
  | "-id"
  | "evaluation_date"
  | "-evaluation_date"
  | "created_at"
  | "-created_at";

export interface BehaviorEvaluationListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: BehaviorEvaluationOrderingT;
  filters?: {
    enrollment?: number;
    academic_period?: number;
  };
}

export interface BehaviorEvaluationFormValues {
  final_scale: number | null;
  override_reason: string;
  general_observation: string;
}

export type BehaviorEvaluationCreateParamsT = BehaviorEvaluationFormValues;
export type BehaviorEvaluationUpdateDataT = Partial<BehaviorEvaluationFormValues>;
export interface BehaviorEvaluationUpdateParamsT {
  id: number;
  data: BehaviorEvaluationUpdateDataT;
}
export interface BehaviorEvaluationGetParamsT {
  id: number;
}
export interface BehaviorEvaluationGetRelatedIncidentsParamsT {
  id: number;
}
export interface BehaviorEvaluationCalculateDataT {
  enrollment_id: number;
  academic_period_id: number;
}

import type { PaginatedResult } from "@shared/types/api.response.types";

export interface BehaviorEvaluationServiceT {
  list(params?: BehaviorEvaluationListParamsT): Promise<PaginatedResult<BehaviorEvaluationT>>;
  get(params: BehaviorEvaluationGetParamsT): Promise<BehaviorEvaluationT>;
  update(params: BehaviorEvaluationUpdateParamsT): Promise<BehaviorEvaluationT>;
  calculate(data: BehaviorEvaluationCalculateDataT): Promise<BehaviorEvaluationT>;
  getRelatedIncidents(params: BehaviorEvaluationGetRelatedIncidentsParamsT): Promise<RelatedConductIncidentT[]>;
}

export interface BehaviorEvaluationCalculateFormValues {
  enrollment_id: number | null;
  academic_period_id: number | null;
}
