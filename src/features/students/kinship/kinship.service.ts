import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type {
  PaginatedData,
  ResponseApi,
} from "@shared/types/api.response.types";
import { KINSHIP_ENDPOINTS } from "./kinship.constants";
import type {
  KinshipGetParamsT,
  KinshipListParamsT,
  KinshipServiceT,
  KinshipT,
} from "./kinship.types";
class KinshipService implements KinshipServiceT {
  async list(p?: KinshipListParamsT): Promise<KinshipT[]> {
    try {
      const pg = p?.page ?? 1;
      const ps = p?.pageSize ?? 100;
      const sq = p?.search ? `&search=${encodeURIComponent(p.search)}` : "";
      const oq = p?.ordering
        ? `&ordering=${encodeURIComponent(p.ordering)}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<KinshipT>>
      >(`${KINSHIP_ENDPOINTS.LIST}?page=${pg}&page_size=${ps}${sq}${oq}`);
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async get(id: KinshipGetParamsT): Promise<KinshipT> {
    try {
      const { data } = await apiClient.get<ResponseApi<KinshipT>>(
        KINSHIP_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}
export const kinshipService = new KinshipService();
