import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, PaginatedResult, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { ABSENCE_TYPE_ENDPOINTS } from "./absence-type.constants";
import type {
  AbsenceTypeCreateParamsT,
  AbsenceTypeDeleteParamsT,
  AbsenceTypeGetParamsT,
  AbsenceTypeListParamsT,
  AbsenceTypeServiceT,
  AbsenceTypeT,
  AbsenceTypeUpdateParamsT,
} from "./absence-type.types";

class AbsenceTypeService implements AbsenceTypeServiceT {
  async list(
    params?: AbsenceTypeListParamsT,
  ): Promise<PaginatedResult<AbsenceTypeT>> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<AbsenceTypeT>>
      >(
        `${ABSENCE_TYPE_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: AbsenceTypeGetParamsT): Promise<AbsenceTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AbsenceTypeT>>(
        ABSENCE_TYPE_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: AbsenceTypeCreateParamsT): Promise<AbsenceTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AbsenceTypeT>>(
        ABSENCE_TYPE_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: AbsenceTypeUpdateParamsT): Promise<AbsenceTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AbsenceTypeT>>(
        ABSENCE_TYPE_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: AbsenceTypeDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<
        ResponseApi<SoftDeleteResponseT>
      >(ABSENCE_TYPE_ENDPOINTS.SOFT_DELETE(params.id), body);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const absenceTypeService = new AbsenceTypeService();
