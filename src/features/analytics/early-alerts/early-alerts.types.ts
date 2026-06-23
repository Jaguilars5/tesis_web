export type AlertTypeT = "low_attendance" | "failing_grades" | "behavioral" | "dropout_risk" | "socioemotional";
export type UrgencyLevelT = "low" | "medium" | "high" | "critical";

export interface EarlyAlertT {
  id: number;
  enrollment: number;
  enrollment_name: string;
  academic_period: number;
  academic_period_name: string;
  alert_type: AlertTypeT | null;
  description: string;
  urgency_level: UrgencyLevelT | null;
  attended: boolean;
  attended_by_user: number | null;
  attended_by_user_name: string;
  detected_at: string;
  attended_at: string | null;
  response_actions: string;
  created_at: string;
  updated_at: string;
}

export type EarlyAlertOrderingT = "detected_at" | "-detected_at" | "urgency_level" | "-urgency_level" | "created_at" | "-created_at";

export interface EarlyAlertFiltersT {
  attended?: boolean;
  urgency_level?: UrgencyLevelT;
  academic_period?: number;
  alert_type?: AlertTypeT;
}

export interface EarlyAlertListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: EarlyAlertOrderingT;
  filters?: EarlyAlertFiltersT;
  /** @deprecated use filters.attended instead */
  attended?: boolean;
  /** @deprecated use filters.urgency_level instead */
  urgency_level?: UrgencyLevelT;
}

export type EarlyAlertCreateDataT = Omit<EarlyAlertT, "id" | "enrollment_name" | "academic_period_name" | "attended_by_user_name" | "attended" | "attended_by_user" | "attended_at" | "detected_at" | "created_at" | "updated_at">;
export type EarlyAlertCreateParamsT = EarlyAlertCreateDataT;
export type EarlyAlertUpdateDataT = Partial<Omit<EarlyAlertT, "id" | "enrollment_name" | "academic_period_name" | "attended_by_user_name" | "attended_at" | "detected_at" | "created_at" | "updated_at">>;
export interface EarlyAlertUpdateParamsT { id: number; data: EarlyAlertUpdateDataT; }
export type EarlyAlertGetParamsT = number;
export type EarlyAlertDeleteParamsT = number;

export interface EarlyAlertMarkAttendedParamsT {
  id: number;
  response_actions: string;
}

export interface EarlyAlertServiceT {
  list(params?: EarlyAlertListParamsT): Promise<EarlyAlertT[]>;
  get(id: EarlyAlertGetParamsT): Promise<EarlyAlertT>;
  create(data: EarlyAlertCreateDataT): Promise<EarlyAlertT>;
  update(params: EarlyAlertUpdateParamsT): Promise<EarlyAlertT>;
  softDelete(id: EarlyAlertDeleteParamsT): Promise<{ id: number }>;
  markAttended(params: EarlyAlertMarkAttendedParamsT): Promise<EarlyAlertT>;
}

export interface EarlyAlertFormValues {
  enrollment: number;
  academic_period: number;
  alert_type: AlertTypeT | "";
  description: string;
  urgency_level: UrgencyLevelT | "";
  response_actions: string;
}
