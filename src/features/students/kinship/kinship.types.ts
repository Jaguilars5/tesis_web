export interface KinshipT {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export type KinshipOrderingT = "name" | "-name";
export interface KinshipListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: KinshipOrderingT;
}
export type KinshipGetParamsT = number;
export interface KinshipServiceT {
  list(p?: KinshipListParamsT): Promise<KinshipT[]>;
  get(id: KinshipGetParamsT): Promise<KinshipT>;
}
