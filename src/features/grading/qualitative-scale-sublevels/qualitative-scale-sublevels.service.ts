import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { QUALITATIVE_SCALE_SUBLEVEL_ENDPOINTS } from "./qualitative-scale-sublevels.constants";
import type {
  QualitativeScaleSublevelCreateDataT,
  QualitativeScaleSublevelDeleteParamsT,
  QualitativeScaleSublevelGetParamsT,
  QualitativeScaleSublevelListParamsT,
  QualitativeScaleSublevelServiceT,
  QualitativeScaleSublevelT,
  QualitativeScaleSublevelUpdateParamsT,
} from "./qualitative-scale-sublevels.types";

class QualitativeScaleSublevelService implements QualitativeScaleSublevelServiceT {
  async list(params?: QualitativeScaleSublevelListParamsT): Promise<QualitativeScaleSublevelT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search ? `&search=${encodeURIComponent(params.search)}` : "";
      const orderingQuery = params?.ordering ? `&ordering=${encodeURIComponent(params.ordering)}` : "";
      const filtersQuery = params?.filters
        ? `&${Object.entries(params.filters)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join("&")}`
        : "";
      const { data } = await apiClient.get<ResponseApi<PaginatedData<QualitativeScaleSublevelT>>>(
        `${QUALITATIVE_SCALE_SUBLEVEL_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: QualitativeScaleSublevelGetParamsT): Promise<QualitativeScaleSublevelT> {
    try {
      const { data } = await apiClient.get<ResponseApi<QualitativeScaleSublevelT>>(
        QUALITATIVE_SCALE_SUBLEVEL_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(data: QualitativeScaleSublevelCreateDataT): Promise<QualitativeScaleSublevelT> {
    try {
      const { data: response } = await apiClient.post<ResponseApi<QualitativeScaleSublevelT>>(
        QUALITATIVE_SCALE_SUBLEVEL_ENDPOINTS.CREATE,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: QualitativeScaleSublevelUpdateParamsT): Promise<QualitativeScaleSublevelT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<QualitativeScaleSublevelT>>(
        QUALITATIVE_SCALE_SUBLEVEL_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: QualitativeScaleSublevelDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        QUALITATIVE_SCALE_SUBLEVEL_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const qualitativeScaleSublevelService = new QualitativeScaleSublevelService();
