import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";

import { EARLY_ALERT_ENDPOINTS } from "./early-alerts.constants";
import type {
  EarlyAlertCreateDataT,
  EarlyAlertDeleteParamsT,
  EarlyAlertGetParamsT,
  EarlyAlertListParamsT,
  EarlyAlertMarkAttendedParamsT,
  EarlyAlertServiceT,
  EarlyAlertT,
  EarlyAlertUpdateParamsT,
} from "./early-alerts.types";

class EarlyAlertService implements EarlyAlertServiceT {
  async list(params?: EarlyAlertListParamsT): Promise<EarlyAlertT[]> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search ? `&search=${encodeURIComponent(params.search)}` : "";
      const orderingQuery = params?.ordering ? `&ordering=${encodeURIComponent(params.ordering)}` : "";
      const filters = params?.filters ?? {};
      const filterKeys = Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== null,
      ) as [string, string | number | boolean][];
      const filterQuery = filterKeys
        .map(([key, value]) => `&${key}=${encodeURIComponent(String(value))}`)
        .join("");
      const attendedLegacy = params?.attended !== undefined ? `&attended=${params.attended}` : "";
      const urgencyLegacy = params?.urgency_level ? `&urgency_level=${params.urgency_level}` : "";
      const { data } = await apiClient.get<ResponseApi<PaginatedData<EarlyAlertT>>>(
        `${EARLY_ALERT_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filterQuery}${attendedLegacy}${urgencyLegacy}`,
      );
      return data.data.results;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(id: EarlyAlertGetParamsT): Promise<EarlyAlertT> {
    try {
      const { data } = await apiClient.get<ResponseApi<EarlyAlertT>>(
        EARLY_ALERT_ENDPOINTS.DETAIL(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: EarlyAlertCreateDataT): Promise<EarlyAlertT> {
    try {
      const { data } = await apiClient.post<ResponseApi<EarlyAlertT>>(
        EARLY_ALERT_ENDPOINTS.LIST,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: EarlyAlertUpdateParamsT): Promise<EarlyAlertT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<EarlyAlertT>>(
        EARLY_ALERT_ENDPOINTS.DETAIL(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(id: EarlyAlertDeleteParamsT): Promise<{ id: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
        EARLY_ALERT_ENDPOINTS.SOFT_DELETE(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async markAttended(params: EarlyAlertMarkAttendedParamsT): Promise<EarlyAlertT> {
    try {
      const { data } = await apiClient.post<ResponseApi<EarlyAlertT>>(
        EARLY_ALERT_ENDPOINTS.MARK_ATTENDED(params.id),
        { response_actions: params.response_actions },
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const earlyAlertService = new EarlyAlertService();
