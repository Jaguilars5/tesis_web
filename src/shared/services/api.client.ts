import axios, { AxiosError } from "axios";

import { tokenManager } from "@features/auth/auth-token.manager";

import { AUTH_ENDPOINTS } from "@features/auth";
import type { InternalAxiosRequestConfig } from "axios";
import type { RefreshResponseT } from "@features/auth/auth.types";

type ApiErrorResponse = {
  msg?: string;
};

let unauthorizedHandler: (() => void) | null = null;

const refreshTokenEndpoint = `${import.meta.env.VITE_API_URL}${AUTH_ENDPOINTS.REFRESH}`;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token?: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown | null, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token ?? undefined);
    }
  });
  failedQueue = [];
}

async function handleTokenRefresh(): Promise<string> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post<RefreshResponseT>(refreshTokenEndpoint, {
    refresh: refreshToken,
  });

  const newAccessToken = response.data.access;
  tokenManager.updateAccessToken(newAccessToken);
  return newAccessToken;
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await handleTokenRefresh();
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        unauthorizedHandler?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.msg ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado";
};
