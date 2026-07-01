export interface NotificationT {
  id: number;
  notification_type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UnreadCountResponseT {
  unread: number;
}
