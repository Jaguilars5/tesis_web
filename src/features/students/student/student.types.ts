export interface PrimaryRepresentativeT {
  id: number;
  user_names: string;
  kinship: number;
  kinship_name: string;
}

export interface StudentT {
  id: number;
  user: number;
  student_code: string;
  special_needs_type: number | null;
  has_special_needs: boolean;
  full_name: string;
  age: number | null;
  is_active: boolean;
  created_at: string;
  primary_representative: PrimaryRepresentativeT | null;
}
export type StudentOrderingT =
  | "user__person__last_names"
  | "-user__person__last_names"
  | "is_active"
  | "-is_active";

export interface StudentListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: StudentOrderingT;
  names?: string;
  last_names?: string;
  document_number?: string;
  student_code?: string;
  is_active?: boolean;
}
export type StudentCreateDataT = {
  document_number: string;
  names: string;
  last_names: string;
  birth_date?: string;
  email?: string;
  phone?: string;
  city?: number;
  document_type?: number;
  has_special_needs?: boolean;
  special_needs_type?: number;
};
export type StudentCreateParamsT = StudentCreateDataT;
export type StudentUpdateDataT = Partial<
  Pick<
    StudentT,
    "student_code" | "is_active" | "special_needs_type" | "has_special_needs"
  >
>;
export interface StudentUpdateParamsT {
  id: number;
  data: StudentUpdateDataT;
}
export type StudentGetParamsT = number;
export type StudentDeleteParamsT = number;
export interface AssignRepresentativeParamsT {
  user_id?: number;
  document_number?: string;
  names?: string;
  last_names?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  document_type?: number | string;
  city?: number | null;
  kinship?: string;
}

export interface StudentServiceT {
  list(p?: StudentListParamsT): Promise<StudentT[]>;
  get(id: StudentGetParamsT): Promise<StudentT>;
  create(d: StudentCreateDataT): Promise<StudentT>;
  update(p: StudentUpdateParamsT): Promise<StudentT>;
  softDelete(id: StudentDeleteParamsT): Promise<{ id: number }>;
  assignRepresentative(studentId: number, data: AssignRepresentativeParamsT): Promise<unknown>;
}
export interface StudentFormValues {
  document_number: string;
  names: string;
  last_names: string;
  birth_date: string;
  email: string;
  phone: string;
  city: number | null;
  document_type: number | null;
  student_code: string;
  is_active: boolean;
  special_needs_type: number | null;
  has_special_needs: boolean;
}
