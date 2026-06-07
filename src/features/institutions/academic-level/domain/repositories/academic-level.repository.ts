import type { AcademicLevelT } from "../entities/academic-level.types";

export interface AcademicLevelListParamsT {
  page?: number;
  pageSize?: number;
}

export interface AcademicLevelRepositoryT {
  list(params?: AcademicLevelListParamsT): Promise<AcademicLevelT[]>;
  get(id: number): Promise<AcademicLevelT>;
  create(data: Omit<AcademicLevelT, "id" | "is_active">): Promise<AcademicLevelT>;
  update(id: number, data: Partial<AcademicLevelT>): Promise<AcademicLevelT>;
  softDelete(id: number): Promise<AcademicLevelT>;
}
