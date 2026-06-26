import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface ConductIncidentT {
  id: number;
  incident_type: number;
  incident_type_name: string;
  severity: number;
  severity_name: string;
  academic_period: number;
  academic_period_name: string;
  enrollment: number;
  enrollment_name: string;
  incident_date: string;
  description: string;
  actions_taken: string;
  family_notified: boolean;
  uuid: string;
  sync_version: number;
  created_at: string;
  updated_at: string;
}

export type ConductIncidentOrderingT = "incident_date" | "-incident_date" | "id" | "-id";

export interface ConductIncidentListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: ConductIncidentOrderingT;
  filters?: {
    enrollment?: number;
  };
}

export interface ConductIncidentFormValues {
  incident_type: number | null;
  severity: number | null;
  academic_period: number | null;
  enrollment: number | null;
  incident_date: string;
  description: string;
  actions_taken: string;
  family_notified: boolean;
}

export type ConductIncidentCreateParamsT = Omit<ConductIncidentT, "id" | "incident_type_name" | "severity_name" | "academic_period_name" | "enrollment_name" | "uuid" | "sync_version" | "created_at" | "updated_at">;
export type ConductIncidentUpdateDataT = Partial<ConductIncidentCreateParamsT>;
export interface ConductIncidentUpdateParamsT {
  id: number;
  data: ConductIncidentUpdateDataT;
}
export interface ConductIncidentGetParamsT {
  id: number;
}
export interface ConductIncidentDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface ConductIncidentServiceT {
  list(params?: ConductIncidentListParamsT): Promise<ConductIncidentT[]>;
  get(params: ConductIncidentGetParamsT): Promise<ConductIncidentT>;
  create(params: ConductIncidentCreateParamsT): Promise<ConductIncidentT>;
  update(params: ConductIncidentUpdateParamsT): Promise<ConductIncidentT>;
  softDelete(params: ConductIncidentDeleteParamsT): Promise<SoftDeleteResponseT>;
}
