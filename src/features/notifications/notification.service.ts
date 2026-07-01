import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, PaginatedResult, ResponseApi } from "@shared/types/api.response.types";

import { NOTIFICATION_ENDPOINTS } from "./notification.constants";
import type { NotificationT, UnreadCountResponseT } from "./notification.types";

class NotificationService {
  async list(): Promise<PaginatedResult<NotificationT>> {
    try {
      const { data } = await apiClient.get<ResponseApi<PaginatedData<NotificationT>>>(
        NOTIFICATION_ENDPOINTS.LIST,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async unreadCount(): Promise<UnreadCountResponseT> {
    try {
      const { data } = await apiClient.get<ResponseApi<UnreadCountResponseT>>(
        NOTIFICATION_ENDPOINTS.UNREAD_COUNT,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async markRead(id: number): Promise<NotificationT> {
    try {
      const { data } = await apiClient.post<ResponseApi<NotificationT>>(
        NOTIFICATION_ENDPOINTS.MARK_READ(id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async markAllRead(): Promise<{ updated: number }> {
    try {
      const { data } = await apiClient.post<ResponseApi<{ updated: number }>>(
        NOTIFICATION_ENDPOINTS.MARK_ALL_READ,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const notificationService = new NotificationService();
