export interface RepresentativeT { id: number; user: number | null; user_name: string; dni: string; names: string; last_names: string; email: string; phone: string; address: string; city: number | null; document_type: string; is_active: boolean; created_at: string; updated_at: string; }
export type RepresentativeOrderingT = "names" | "-names" | "last_names" | "-last_names" | "dni" | "-dni";
export interface RepresentativeListParamsT { page?: number; pageSize?: number; search?: string; ordering?: RepresentativeOrderingT; }
export type RepresentativeCreateDataT = Omit<RepresentativeT, "id" | "user" | "is_active" | "user_name" | "created_at" | "updated_at">;
export type RepresentativeCreateParamsT = RepresentativeCreateDataT;
export type RepresentativeUpdateDataT = Partial<Omit<RepresentativeT, "id">>;
export interface RepresentativeUpdateParamsT { id: number; data: RepresentativeUpdateDataT; }
export type RepresentativeGetParamsT = number;
export type RepresentativeDeleteParamsT = number;
export interface RepresentativeServiceT { list(p?: RepresentativeListParamsT): Promise<RepresentativeT[]>; get(id: RepresentativeGetParamsT): Promise<RepresentativeT>; create(d: RepresentativeCreateDataT): Promise<RepresentativeT>; update(p: RepresentativeUpdateParamsT): Promise<RepresentativeT>; softDelete(id: RepresentativeDeleteParamsT): Promise<{ id: number }>; }
export interface RepresentativeFormValues { dni: string; names: string; last_names: string; email: string; phone: string; address: string; city: number | null; document_type: string; is_active: boolean; }
