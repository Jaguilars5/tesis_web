import type { RequestStatusT } from "@shared/types/commonTypes";

export type Student = {
  id: number;
  uuid: string;
  dni: string;
  names: string;
  last_names: string;
  full_name: string;
  birth_date: string;
  age: number;
  section: number;
  section_name: string;
  enrollment_number: string | null;
  enrollment_date: string;
  active: boolean;
  sync_status: string;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sync_version: number;
  device_origin: string | null;
};

export type StudentCreateRequest = Omit<
  Student,
  | "id"
  | "uuid"
  | "full_name"
  | "age"
  | "section_name"
  | "enrollment_date"
  | "active"
  | "sync_status"
  | "synced_at"
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "sync_version"
  | "device_origin"
> & {
  enrollment_number?: string | null;
};
export type StudentUpdateRequest = Partial<StudentCreateRequest> & {
  id: number;
};
export type StudentDeleteRequest = { id: number };

export type StudentsState = {
  entities: Student[];
  status: RequestStatusT;
  error: string | null;
};
