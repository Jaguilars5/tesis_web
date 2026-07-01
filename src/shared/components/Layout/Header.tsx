import { Bell, GraduationCap, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useNotificationController } from "@features/notifications/hooks/useNotificationController";
import { NotificationDropdown } from "@features/notifications/components/NotificationDropdown";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { unreadCount, togglePanel, loadUnreadCount } = useNotificationController();
  const [shake, setShake] = useState(false);
  const prevCountRef = useRef(unreadCount);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 400);
      prevCountRef.current = unreadCount;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden flex-1 max-w-md lg:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Búsqueda global..."
          className="w-full rounded-md bg-[#f3f3f5] py-1.5 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-slate-300"
        />
      </div>

      <div className="flex w-full items-center justify-between lg:w-auto lg:justify-end">
        <div className="flex items-center gap-2 lg:hidden">
          <GraduationCap className="size-5 text-primary" />
          <span className="text-sm font-extrabold">EduManage</span>
        </div>

        <div className="relative">
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Notificaciones"
            onClick={togglePanel}
          >
            <Bell className={`size-4 ${shake ? "animate-shake" : ""}`} />
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
}
