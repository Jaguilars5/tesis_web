export interface SpecialNeedsTypeT {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SpecialNeedsTypeOrderingT = "name" | "-name";

export interface SpecialNeedsTypeListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: SpecialNeedsTypeOrderingT;
}

export type SpecialNeedsTypeGetParamsT = number;

export interface SpecialNeedsTypeServiceT {
  list(p?: SpecialNeedsTypeListParamsT): Promise<SpecialNeedsTypeT[]>;
  get(id: SpecialNeedsTypeGetParamsT): Promise<SpecialNeedsTypeT>;
}
