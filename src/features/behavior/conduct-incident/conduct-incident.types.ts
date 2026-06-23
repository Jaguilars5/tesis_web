export interface ConductIncidentT {
  id: number; incident_type: number; incident_type_name: string; severity: number; severity_name: string;
  academic_period: number; academic_period_name: string; enrollment: number; enrollment_name: string;
  incident_date: string; description: string; actions_taken: string; family_notified: boolean;
  uuid: string; sync_version: number; created_at: string; updated_at: string;
}

export type ConductIncidentOrderingT = "incident_date" | "-incident_date" | "id" | "-id";
export interface ConductIncidentListParamsT { page?: number; pageSize?: number; search?: string; ordering?: ConductIncidentOrderingT; enrollment?: number; }
export type ConductIncidentCreateDataT = Omit<ConductIncidentT, "id" | "incident_type_name" | "severity_name" | "academic_period_name" | "enrollment_name" | "uuid" | "sync_version" | "created_at" | "updated_at">;
export type ConductIncidentCreateParamsT = ConductIncidentCreateDataT;
export type ConductIncidentUpdateDataT = Partial<Omit<ConductIncidentT, "id">>;
export interface ConductIncidentUpdateParamsT { id: number; data: ConductIncidentUpdateDataT; }
export type ConductIncidentGetParamsT = number;

export interface ConductIncidentServiceT {
  list(params?: ConductIncidentListParamsT): Promise<ConductIncidentT[]>;
  get(id: ConductIncidentGetParamsT): Promise<ConductIncidentT>;
  create(data: ConductIncidentCreateDataT): Promise<ConductIncidentT>;
  update(params: ConductIncidentUpdateParamsT): Promise<ConductIncidentT>;
}

export interface ConductIncidentFormValues {
  incident_type: number | null; severity: number | null; academic_period: number | null;
  enrollment: number | null; incident_date: string; description: string; actions_taken: string; family_notified: boolean;
}
