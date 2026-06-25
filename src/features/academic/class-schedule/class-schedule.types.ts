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

export interface ClassScheduleFormValues {
  teacher_subject_section: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
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
  filters?: {
    teacher_subject_section?: number;
    day_of_week?: number;
  };
  ordering?: ClassScheduleOrderingT;
}

export type ClassScheduleCreateParamsT = ClassScheduleFormValues;

export type ClassScheduleUpdateDataT = Partial<ClassScheduleFormValues>;

export interface ClassScheduleUpdateParamsT {
  id: number;
  data: ClassScheduleUpdateDataT;
}

export interface ClassScheduleGetParamsT {
  id: number;
}

export interface ClassScheduleDeleteParamsT {
  id: number;
}

export interface ClassScheduleServiceT {
  list(params?: ClassScheduleListParamsT): Promise<ClassScheduleT[]>;
  get(params: ClassScheduleGetParamsT): Promise<ClassScheduleT>;
  create(params: ClassScheduleCreateParamsT): Promise<ClassScheduleT>;
  update(params: ClassScheduleUpdateParamsT): Promise<ClassScheduleT>;
  softDelete(params: ClassScheduleDeleteParamsT): Promise<{ id: number }>;
}
