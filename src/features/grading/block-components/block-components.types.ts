export interface BlockComponentT { id: number; code: string; evaluation_block: number; evaluation_block_name: string; name: string; internal_weight: number; is_active: boolean; created_at: string; updated_at: string; }
export type BlockComponentOrderingT = "name" | "-name" | "code" | "-code" | "internal_weight" | "-internal_weight" | "evaluation_block_name" | "-evaluation_block_name";
export interface BlockComponentListParamsT { page?: number; pageSize?: number; search?: string; ordering?: BlockComponentOrderingT; filters?: Record<string, string | number | boolean>; }
export type BlockComponentCreateDataT = Omit<BlockComponentT, "id" | "is_active" | "evaluation_block_name" | "created_at" | "updated_at">;
export type BlockComponentCreateParamsT = BlockComponentCreateDataT;
export type BlockComponentUpdateDataT = Partial<Omit<BlockComponentT, "id">>;
export interface BlockComponentUpdateParamsT { id: number; data: BlockComponentUpdateDataT; }
export type BlockComponentGetParamsT = number;
export type BlockComponentDeleteParamsT = number;
export interface BlockComponentServiceT { list(p?: BlockComponentListParamsT): Promise<BlockComponentT[]>; get(id: BlockComponentGetParamsT): Promise<BlockComponentT>; create(d: BlockComponentCreateDataT): Promise<BlockComponentT>; update(p: BlockComponentUpdateParamsT): Promise<BlockComponentT>; softDelete(id: BlockComponentDeleteParamsT): Promise<{ id: number }>; }
export interface BlockComponentFormValues { code: string; name: string; internal_weight: number; evaluation_block: number; is_active: boolean; }
