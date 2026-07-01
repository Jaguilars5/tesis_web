import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback } from "react";

import { notificationService } from "../notification.service";
import {
  markAllRead,
  markRead,
  selectNotifications,
  selectNotificationsLoading,
  selectNotificationsPanelOpen,
  selectUnreadCount,
  setLoading,
  setNotifications,
  setPanelOpen,
  setUnreadCount,
  togglePanel,
} from "../notification.slice";

export const useNotificationController = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const isOpen = useAppSelector(selectNotificationsPanelOpen);
  const loading = useAppSelector(selectNotificationsLoading);

  const loadNotifications = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const result = await notificationService.list();
      dispatch(setNotifications(result.items));
    } catch {
      // silent
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.unreadCount();
      dispatch(setUnreadCount(result.unread));
    } catch {
      // silent
    }
  }, [dispatch]);

  const handleMarkRead = useCallback(
    async (id: number) => {
      try {
        await notificationService.markRead(id);
        dispatch(markRead(id));
      } catch {
        // silent
      }
    },
    [dispatch],
  );

  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationService.markAllRead();
      dispatch(markAllRead());
    } catch {
      // silent
    }
  }, [dispatch]);

  const handleTogglePanel = useCallback(() => {
    dispatch(togglePanel());
  }, [dispatch]);

  const closePanel = useCallback(() => {
    dispatch(setPanelOpen(false));
  }, [dispatch]);

  return {
    notifications,
    unreadCount,
    isOpen,
    loading,
    loadNotifications,
    loadUnreadCount,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
    togglePanel: handleTogglePanel,
    closePanel,
  };
};

export type NotificationControllerT = ReturnType<typeof useNotificationController>;
