import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";

import type { NotificationT } from "./notification.types";

export interface NotificationStateT {
  notifications: NotificationT[];
  unreadCount: number;
  isOpen: boolean;
  loading: boolean;
}

const initialState: NotificationStateT = {
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  loading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationT[]>) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.is_read).length;
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    incrementUnread(state) {
      state.unreadCount += 1;
    },
    markRead(state, action: PayloadAction<number>) {
      const idx = state.notifications.findIndex((n) => n.id === action.payload);
      if (idx !== -1) {
        state.notifications[idx].is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => {
        n.is_read = true;
      });
      state.unreadCount = 0;
    },
    togglePanel(state) {
      state.isOpen = !state.isOpen;
    },
    setPanelOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setNotifications,
  setUnreadCount,
  incrementUnread,
  markRead,
  markAllRead,
  togglePanel,
  setPanelOpen,
  setLoading,
} = notificationSlice.actions;

export const selectNotifications = (state: RootState): NotificationT[] =>
  state.notifications.notifications;

export const selectUnreadCount = (state: RootState): number =>
  state.notifications.unreadCount;

export const selectNotificationsPanelOpen = (state: RootState): boolean =>
  state.notifications.isOpen;

export const selectNotificationsLoading = (state: RootState): boolean =>
  state.notifications.loading;

export const notificationReducer = notificationSlice.reducer;

export default notificationSlice.reducer;
