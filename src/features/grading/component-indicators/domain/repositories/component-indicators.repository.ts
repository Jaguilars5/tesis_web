import type { ComponentIndicatorT } from "../entities/component-indicators.types";

export interface ComponentIndicatorListParamsT { page?: number; pageSize?: number; }

export interface ComponentIndicatorRepositoryT {
  list(params?: ComponentIndicatorListParamsT): Promise<ComponentIndicatorT[]>;
  get(id: number): Promise<ComponentIndicatorT>;
  create(data: Omit<ComponentIndicatorT, "id" | "block_component_name">): Promise<ComponentIndicatorT>;
  update(id: number, data: Partial<ComponentIndicatorT>): Promise<ComponentIndicatorT>;
  softDelete(id: number): Promise<ComponentIndicatorT>;
}
