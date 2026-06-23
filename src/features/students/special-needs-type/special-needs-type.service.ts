import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";

import { SPECIAL_NEEDS_TYPE_ENDPOINTS } from "./special-needs-type.constants";
import type {
  SpecialNeedsTypeGetParamsT,
  SpecialNeedsTypeListParamsT,
  SpecialNeedsTypeServiceT,
  SpecialNeedsTypeT,
} from "./special-needs-type.types";

class SpecialNeedsTypeService implements SpecialNeedsTypeServiceT {
  async list(p?: SpecialNeedsTypeListParamsT): Promise<SpecialNeedsTypeT[]> {
    try {
      const pg = p?.page ?? 1;
      const ps = p?.pageSize ?? 100;
      const sq = p?.search ? `&search=${encodeURIComponent(p.search)}` : "";
      const oq = p?.ordering ? `&ordering=${encodeURIComponent(p.ordering)}` : "";
      const { data } = await apiClient.get<ResponseApi<PaginatedData<SpecialNeedsTypeT>>>(
        `${SPECIAL_NEEDS_TYPE_ENDPOINTS.LIST}?page=${pg}&page_size=${ps}${sq}${oq}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: SpecialNeedsTypeGetParamsT): Promise<SpecialNeedsTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<SpecialNeedsTypeT>>(
        SPECIAL_NEEDS_TYPE_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const specialNeedsTypeService = new SpecialNeedsTypeService();
