import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";

import type { AuthUserT } from "@features/auth/auth.types";

export const PROFILE_ENDPOINT = "/api/iam/users/";

class ProfileService {
  async update(id: number, data: Partial<AuthUserT>): Promise<AuthUserT> {
    try {
      const { data: response } = await apiClient.patch<ResponseApi<AuthUserT>>(
        `${PROFILE_ENDPOINT}${id}/`,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const profileService = new ProfileService();
