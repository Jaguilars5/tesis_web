import type { SubjectOfferingT } from "../entities/subject-offering.types";

export interface SubjectOfferingListParamsT {
  page?: number;
  pageSize?: number;
}

export type SubjectOfferingCreateDataT = Omit<
  SubjectOfferingT,
  "id" | "is_active" | "school_year_name" | "section_name" | "subject_academic_config_name"
>;

export interface SubjectOfferingRepositoryT {
  list(params?: SubjectOfferingListParamsT): Promise<SubjectOfferingT[]>;
  get(id: number): Promise<SubjectOfferingT>;
  create(data: SubjectOfferingCreateDataT): Promise<SubjectOfferingT>;
  update(id: number, data: Partial<SubjectOfferingT>): Promise<SubjectOfferingT>;
  softDelete(id: number): Promise<SubjectOfferingT>;
}
