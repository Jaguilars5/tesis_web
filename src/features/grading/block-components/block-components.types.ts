import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export interface BlockComponentT {
  id: number;
  code: string;
  evaluation_block: number;
  evaluation_block_name: string;
  name: string;
  internal_weight: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BlockComponentOrderingT =
  | "name" | "-name" | "code" | "-code"
  | "internal_weight" | "-internal_weight"
  | "evaluation_block_name" | "-evaluation_block_name";

export interface BlockComponentListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: BlockComponentOrderingT;
  filters?: {
    evaluation_block?: number;
    academic_period?: number;
    is_active?: boolean;
  };
}

export interface BlockComponentFormValues {
  code: string;
  name: string;
  internal_weight: number;
  evaluation_block: number;
}

export type BlockComponentCreateParamsT = BlockComponentFormValues;
export type BlockComponentUpdateDataT = Partial<BlockComponentFormValues>;
export interface BlockComponentUpdateParamsT {
  id: number;
  data: BlockComponentUpdateDataT;
}
export interface BlockComponentGetParamsT {
  id: number;
}
export interface BlockComponentDeleteParamsT {
  id: number;
  confirm?: boolean;
}

export interface BlockComponentServiceT {
  list(params?: BlockComponentListParamsT): Promise<BlockComponentT[]>;
  get(params: BlockComponentGetParamsT): Promise<BlockComponentT>;
  create(params: BlockComponentCreateParamsT): Promise<BlockComponentT>;
  update(params: BlockComponentUpdateParamsT): Promise<BlockComponentT>;
  softDelete(params: BlockComponentDeleteParamsT): Promise<SoftDeleteResponseT>;
}
