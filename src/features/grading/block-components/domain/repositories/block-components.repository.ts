import type { BlockComponentT } from "../entities/block-components.types";
export interface BlockComponentListParamsT { page?: number; pageSize?: number; }
export interface BlockComponentRepositoryT {
  list(params?: BlockComponentListParamsT): Promise<BlockComponentT[]>;
  get(id: number): Promise<BlockComponentT>;
  create(data: Omit<BlockComponentT, "id" | "evaluation_block_name">): Promise<BlockComponentT>;
  update(id: number, data: Partial<BlockComponentT>): Promise<BlockComponentT>;
  softDelete(id: number): Promise<BlockComponentT>;
}
