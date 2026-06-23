export interface ClassScheduleT {
  id: number;
  teacher_subject_section: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  subject_offering_name: string;
  day_of_week_name: string;
  created_at: string;
  updated_at: string;
}

export type ClassScheduleOrderingT =
  | "day_of_week"
  | "-day_of_week"
  | "start_time"
  | "-start_time";

export interface ClassScheduleListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: ClassScheduleOrderingT;
}

export type ClassScheduleCreateDataT = Omit<
  ClassScheduleT,
  | "id"
  | "is_active"
  | "subject_offering_name"
  | "day_of_week_name"
  | "created_at"
  | "updated_at"
>;

export type ClassScheduleCreateParamsT = ClassScheduleCreateDataT;

export type ClassScheduleUpdateDataT = Partial<Omit<ClassScheduleT, "id">>;

export interface ClassScheduleUpdateParamsT {
  id: number;
  data: ClassScheduleUpdateDataT;
}

export type ClassScheduleGetParamsT = number;

export type ClassScheduleDeleteParamsT = number;

export interface ClassScheduleServiceT {
  list(params?: ClassScheduleListParamsT): Promise<ClassScheduleT[]>;
  get(id: ClassScheduleGetParamsT): Promise<ClassScheduleT>;
  create(data: ClassScheduleCreateDataT): Promise<ClassScheduleT>;
  update(params: ClassScheduleUpdateParamsT): Promise<ClassScheduleT>;
  softDelete(id: ClassScheduleDeleteParamsT): Promise<{ id: number }>;
}

export interface ClassScheduleFormValues {
  teacher_subject_section: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}
