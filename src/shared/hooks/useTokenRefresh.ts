import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  initializationComplete,
  sessionExpired,
} from "../../features/auth/reducers/auth.reducer";
import { refreshSession } from "../../features/auth/reducers/auth.reducer";
import { tokenManager } from "../../features/auth/infrastructure/repositories/auth-token.repository";
import type { AppDispatch } from "../redux/store";
import { setUnauthorizedHandler } from "../services/api.client";

const CHECK_INTERVAL_MS = 30 * 1000;

export const useTokenRefresh = () => {
  const dispatch = useDispatch<AppDispatch>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(sessionExpired());
    });
  }, [dispatch]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function initSession() {
      if (!tokenManager.hasRefreshToken()) {
        dispatch(initializationComplete());
        return;
      }

      if (!tokenManager.hasAccessToken()) {
        const result = await dispatch(refreshSession());
        if (refreshSession.rejected.match(result)) {
          dispatch(initializationComplete());
        }
      } else {
        dispatch(initializationComplete());
      }
    }

    initSession();
  }, [dispatch]);

  useEffect(() => {
    if (!tokenManager.hasRefreshToken()) {
      return;
    }

    async function tryRefresh() {
      if (!tokenManager.hasAccessToken()) {
        dispatch(sessionExpired());
        return;
      }

      if (tokenManager.isAccessTokenNearExpiry()) {
        const result = await dispatch(refreshSession());
        if (refreshSession.rejected.match(result)) {
          dispatch(sessionExpired());
        }
      }
    }

    intervalRef.current = setInterval(tryRefresh, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch]);
};
