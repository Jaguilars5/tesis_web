export interface SubjectT {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SubjectOrderingT = "name" | "-name" | "code" | "-code";

export interface SubjectListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: SubjectOrderingT;
}

export type SubjectCreateDataT = Omit<
  SubjectT,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export type SubjectCreateParamsT = SubjectCreateDataT;

export type SubjectUpdateDataT = Partial<Omit<SubjectT, "id">>;

export interface SubjectUpdateParamsT {
  id: number;
  data: SubjectUpdateDataT;
}

export type SubjectGetParamsT = number;

export type SubjectDeleteParamsT = number;

export interface SubjectServiceT {
  list(params?: SubjectListParamsT): Promise<SubjectT[]>;
  get(id: SubjectGetParamsT): Promise<SubjectT>;
  create(data: SubjectCreateDataT): Promise<SubjectT>;
  update(params: SubjectUpdateParamsT): Promise<SubjectT>;
  softDelete(id: SubjectDeleteParamsT): Promise<{ id: number }>;
}

export interface SubjectFormValues {
  name: string;
  code: string;
  is_active: boolean;
}
