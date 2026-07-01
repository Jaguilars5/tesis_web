import { createContext, useEffect, type ReactNode } from "react";
import type { Socket } from "socket.io-client";

import { incrementUnread } from "@features/notifications/notification.slice";
import { addCompletedTaskId } from "@features/analytics/risk-score.slice";
import { useAppDispatch } from "../redux/hooks";
import { useSocket } from "../hooks/useSocket";

export interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
});

function GlobalTaskListener({ socket }: { socket: Socket | null }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    const taskHandler = (data: { task_id: string }) => {
      dispatch(addCompletedTaskId(data.task_id));
    };
    const notificationHandler = () => {
      dispatch(incrementUnread());
    };

    socket.on("task_completed", taskHandler);
    socket.on("notification", notificationHandler);

    return () => {
      socket.off("task_completed", taskHandler);
      socket.off("notification", notificationHandler);
    };
  }, [socket, dispatch]);

  return null;
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const { socket, connected } = useSocket();

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      <GlobalTaskListener socket={socket} />
      {children}
    </SocketContext.Provider>
  );
}
