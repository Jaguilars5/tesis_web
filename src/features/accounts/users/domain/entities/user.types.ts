export interface UserT {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: number;
  role_name?: string;
  created_at: string;
  updated_at: string;
}

export type UserListParamsT = {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: string;
};
