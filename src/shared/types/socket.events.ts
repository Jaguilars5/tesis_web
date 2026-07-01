export interface TaskCompletedEvent {
  task_id: string;
  result: {
    total: number;
    processed: number;
    failed: number;
  };
}

export interface NotificationEvent {
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
}

export interface SocketEventMap {
  task_completed: TaskCompletedEvent;
  notification: NotificationEvent;
}

export type SocketEventName = keyof SocketEventMap;

export type SocketEventData<T extends SocketEventName> =
  T extends keyof SocketEventMap ? SocketEventMap[T] : never;
