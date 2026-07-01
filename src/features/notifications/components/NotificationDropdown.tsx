import { format as fechaFormat } from "fecha";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  ClipboardList,
  GraduationCap,
  Loader2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { useNotificationController } from "../hooks/useNotificationController";
import type { NotificationT } from "../notification.types";

function NotificationIcon({
  notification_type,
  className,
}: { notification_type: string; className?: string }) {
  switch (notification_type) {
    case "ACTIVITY_CREATED":
      return <ClipboardList className={className} />;
    case "ACTIVITY_GRADED":
      return <GraduationCap className={className} />;
    case "ATTENDANCE_CREATED":
      return <Users className={className} />;
    case "INCIDENT_CREATED":
      return <AlertTriangle className={className} />;
    default:
      return <Bell className={className} />;
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays}d`;

  return fechaFormat(new Date(dateStr), "DD MMM YYYY");
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: NotificationT;
  onMarkRead: (id: number) => void;
}) {
  return (
    <button
      type="button"
      className={`w-full text-left px-4 py-3 flex gap-3 transition hover:bg-slate-50 ${
        !notification.is_read ? "bg-blue-50/70" : ""
      }`}
      onClick={() => {
        if (!notification.is_read) onMarkRead(notification.id);
      }}
    >
      <div className="mt-0.5 shrink-0">
        <NotificationIcon
          notification_type={notification.notification_type}
          className="size-4 text-slate-500"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 truncate">
          {notification.title}
        </p>
        {notification.body && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
            {notification.body}
          </p>
        )}
      </div>
      <div className="shrink-0">
        <span className="text-[11px] text-slate-400 whitespace-nowrap">
          {timeAgo(notification.created_at)}
        </span>
      </div>
    </button>
  );
}

export function NotificationDropdown() {
  const { notifications, loading, isOpen, loadNotifications, markRead, markAllRead, closePanel } =
    useNotificationController();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closePanel();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closePanel]);

  if (!isOpen) return null;

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 z-50 w-[400px] max-h-[520px] bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <h3 className="text-sm font-semibold text-slate-900">Notificaciones</h3>
        <div className="flex items-center gap-2">
          {hasUnread && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition"
            >
              <CheckCheck className="size-3.5" />
              Marcar todo leído
            </button>
          )}
          <button
            type="button"
            onClick={closePanel}
            className="p-1 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-5 animate-spin text-slate-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Bell className="size-8 mb-2" />
            <p className="text-sm">No hay notificaciones</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
