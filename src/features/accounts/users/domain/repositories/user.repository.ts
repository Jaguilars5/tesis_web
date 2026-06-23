import type { UserListParamsT, UserT } from "../entities/user.types";

export type { UserListParamsT };

export interface UserRepositoryT {
  list: (params?: UserListParamsT) => Promise<UserT[]>;
}
