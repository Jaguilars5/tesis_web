import type { RequestStatusT } from "@shared/types/commonTypes";

export type Representative = {
  id: number;
  dni: string;
  names: string;
  last_names: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type RepresentativeCreateRequest = Omit<
  Representative,
  "id" | "full_name" | "active" | "created_at" | "updated_at"
>;
export type RepresentativeUpdateRequest =
  Partial<RepresentativeCreateRequest> & { id: number };
export type RepresentativeDeleteRequest = { id: number };

export type RepresentativesState = {
  entities: Representative[];
  status: RequestStatusT;
  error: string | null;
};
