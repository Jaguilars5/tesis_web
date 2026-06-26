import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { QUALITATIVE_SCALES_ENDPOINTS } from "./qualitative-scales.constants";
import type {
  QualitativeScaleCreateDataT,
  QualitativeScaleDeleteParamsT,
  QualitativeScaleGetParamsT,
  QualitativeScaleListParamsT,
  QualitativeScaleServiceT,
  QualitativeScaleT,
  QualitativeScaleUpdateParamsT,
} from "./qualitative-scales.types";

class QualitativeScaleService implements QualitativeScaleServiceT {
  async list(params?: QualitativeScaleListParamsT): Promise<QualitativeScaleT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search ? `&search=${encodeURIComponent(params.search)}` : "";
      const orderingQuery = params?.ordering ? `&ordering=${encodeURIComponent(params.ordering)}` : "";
      const { data } = await apiClient.get<ResponseApi<PaginatedData<QualitativeScaleT>>>(
        `${QUALITATIVE_SCALES_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: QualitativeScaleGetParamsT): Promise<QualitativeScaleT> {
    try {
      const { data } = await apiClient.get<ResponseApi<QualitativeScaleT>>(
        QUALITATIVE_SCALES_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(data: QualitativeScaleCreateDataT): Promise<QualitativeScaleT> {
    try {
      const { data: response } = await apiClient.post<ResponseApi<QualitativeScaleT>>(
        QUALITATIVE_SCALES_ENDPOINTS.CREATE,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: QualitativeScaleUpdateParamsT): Promise<QualitativeScaleT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<QualitativeScaleT>>(
        QUALITATIVE_SCALES_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(params: QualitativeScaleDeleteParamsT): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<ResponseApi<SoftDeleteResponseT>>(
        QUALITATIVE_SCALES_ENDPOINTS.SOFT_DELETE(params.id),
        body,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const qualitativeScaleService = new QualitativeScaleService();
