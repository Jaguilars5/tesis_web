import type { SubjectT } from "../entities/subject.types";

export interface SubjectListParamsT {
  page?: number;
  pageSize?: number;
}

export interface SubjectRepositoryT {
  list(params?: SubjectListParamsT): Promise<SubjectT[]>;
  get(id: number): Promise<SubjectT>;
  create(data: Omit<SubjectT, "id" | "is_active">): Promise<SubjectT>;
  update(id: number, data: Partial<SubjectT>): Promise<SubjectT>;
  softDelete(id: number): Promise<SubjectT>;
}
