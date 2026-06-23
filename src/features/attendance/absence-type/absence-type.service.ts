import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
import { ABSENCE_TYPE_ENDPOINTS } from "./absence-type.constants";
import type {
  AbsenceTypeCreateDataT,
  AbsenceTypeDeleteParamsT,
  AbsenceTypeGetParamsT,
  AbsenceTypeListParamsT,
  AbsenceTypeServiceT,
  AbsenceTypeT,
  AbsenceTypeUpdateParamsT,
} from "./absence-type.types";

class AbsenceTypeService implements AbsenceTypeServiceT {
  async list(params?: AbsenceTypeListParamsT): Promise<AbsenceTypeT[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set("page", String(params.page));
      if (params?.pageSize) queryParams.set("page_size", String(params.pageSize));
      if (params?.search) queryParams.set("search", params.search);
      if (params?.ordering) queryParams.set("ordering", params.ordering);
      const query = queryParams.toString();
      const url = query ? `${ABSENCE_TYPE_ENDPOINTS.LIST}?${query}` : ABSENCE_TYPE_ENDPOINTS.LIST;
      const { data } = await apiClient.get<ResponseApi<PaginatedData<AbsenceTypeT>>>(url);
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: AbsenceTypeGetParamsT): Promise<AbsenceTypeT> {
    try {
      const { data } = await apiClient.get<ResponseApi<AbsenceTypeT>>(ABSENCE_TYPE_ENDPOINTS.DETAIL(id));
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: AbsenceTypeCreateDataT): Promise<AbsenceTypeT> {
    try {
      const { data } = await apiClient.post<ResponseApi<AbsenceTypeT>>(ABSENCE_TYPE_ENDPOINTS.LIST, payload);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: AbsenceTypeUpdateParamsT): Promise<AbsenceTypeT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<AbsenceTypeT>>(
        ABSENCE_TYPE_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async delete(id: AbsenceTypeDeleteParamsT): Promise<{ id: number }> {
    try {
      await apiClient.delete(ABSENCE_TYPE_ENDPOINTS.DETAIL(id));
      return { id };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const absenceTypeService = new AbsenceTypeService();
