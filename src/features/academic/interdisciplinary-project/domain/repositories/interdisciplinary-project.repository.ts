import type { InterdisciplinaryProjectT } from "../entities/interdisciplinary-project.types";

export interface InterdisciplinaryProjectRepositoryT {
  list(params?: { page?: number; pageSize?: number }): Promise<InterdisciplinaryProjectT[]>;
  get(id: number): Promise<InterdisciplinaryProjectT>;
  create(data: Omit<InterdisciplinaryProjectT, "id" | "is_active" | "academic_period_name">): Promise<InterdisciplinaryProjectT>;
  update(id: number, data: Partial<InterdisciplinaryProjectT>): Promise<InterdisciplinaryProjectT>;
  softDelete(id: number): Promise<InterdisciplinaryProjectT>;
}
