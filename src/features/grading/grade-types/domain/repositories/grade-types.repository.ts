import type { GradeTypeT } from "../entities/grade-types.types";
export interface GradeTypeListParamsT { page?: number; pageSize?: number; }
export interface GradeTypeRepositoryT {
  list(params?: GradeTypeListParamsT): Promise<GradeTypeT[]>;
  get(id: number): Promise<GradeTypeT>;
  create(data: Omit<GradeTypeT, "id" | "is_active" | "created_at" | "updated_at">): Promise<GradeTypeT>;
  update(id: number, data: Partial<GradeTypeT>): Promise<GradeTypeT>;
  softDelete(id: number): Promise<GradeTypeT>;
}
