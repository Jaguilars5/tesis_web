import {
  protectedRoutes,
  type RoutesConfigGroup,
  type RoutesConfigItem,
} from "@app/routes.config";
import { ChevronDown, ChevronRight, GraduationCap, LogOut } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { selectAuthUser } from "../../../features/auth/reducers/auth.selectors";
import { logout } from "../../../features/auth/reducers/auth.reducer";
import type { UserRoleT } from "../../../features/auth/domain/entities/auth.types";
import { useAllowedRoutes } from "../../hooks/useAllowedRoutes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { roleLabels } from "../../utils/roles";

interface NavbarProps {
  onClose?: () => void;
}

const isNavGroup = (route: RoutesConfigItem): route is RoutesConfigGroup => {
  return "children" in route && Array.isArray(route.children);
};

const useActiveKey = () => {
  const { pathname } = useLocation();
  for (const entry of protectedRoutes) {
    if (!isNavGroup(entry) && entry.path === pathname) return entry.key;
    if (isNavGroup(entry)) {
      for (const item of entry.children) {
        if (item.path === pathname) return item.key;
      }
    }
  }
  return "";
};

const getGroupOfPath = (pathname: string): RoutesConfigGroup | undefined => {
  for (const entry of protectedRoutes) {
    if (isNavGroup(entry)) {
      for (const item of entry.children) {
        if (item.path === pathname) return entry;
      }
    }
  }
  return undefined;
};

export const Navbar = ({ onClose }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const allowedRoutes = useAllowedRoutes();
  const activeKey = useActiveKey();
  const activeGroup =
    getGroupOfPath(activeKey ? `/${activeKey}` : "")?.key ?? "";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => ({
    [activeGroup]: true,
  }));

  const allowedPaths = useMemo(
    () => new Set(allowedRoutes.map((r) => r.path)),
    [allowedRoutes],
  );

  const filteredRoutes = useMemo(() => {
    if (!user?.role) return [];

    const hasRoleAccess = (routeRoles: UserRoleT[]): boolean => {
      if (routeRoles.length === 0) return true;
      return routeRoles.includes(user.role);
    };

    const hasPathAccess = (route: RoutesConfigItem): boolean => {
      if (isNavGroup(route)) return true;
      return allowedPaths.has(route.path);
    };

    return protectedRoutes
      .filter((route) => route.isVisibleInNavbar)
      .filter(
        (route) => hasRoleAccess(route.roles) && hasPathAccess(route),
      )
      .map((route) => {
        if (!isNavGroup(route)) return route;
        return {
          ...route,
          children: route.children.filter(
            (child) =>
              allowedPaths.has(child.path) && hasRoleAccess(child.roles),
          ),
        };
      })
      .filter((route) => {
        if (!isNavGroup(route)) return true;
        return route.children.length > 0;
      });
  }, [allowedPaths, user]);

  const toggle = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const initials = (user?.names ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 p-4">
        <div className="rounded-lg bg-primary p-2 text-white">
          <GraduationCap className="size-5" />
        </div>
        <div>
          <span className="text-sm font-extrabold tracking-tight">
            EduManage
          </span>
          <p className="text-[10px] font-medium text-slate-500">
            Gestión académica
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {filteredRoutes.map((entry) => {
          if (!isNavGroup(entry)) {
            const isActive = activeKey === entry.key;
            return (
              <NavLink
                key={entry.key}
                to={entry.path}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {entry.icon && <entry.icon className="size-4 shrink-0" />}
                <span>{entry.title}</span>
              </NavLink>
            );
          }

          const hasActiveChild = entry.children.some(
            (item) => item.key === activeKey,
          );
          const isOpen = openGroups[entry.key];

          return (
            <div key={entry.key}>
              <button
                onClick={() => toggle(entry.key)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  hasActiveChild
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {entry.icon && <entry.icon className="size-4 shrink-0" />}
                <span className="flex-1 text-left">{entry.title}</span>
                {isOpen ? (
                  <ChevronDown className="size-4 shrink-0 text-slate-400" />
                ) : (
                  <ChevronRight className="size-4 shrink-0 text-slate-400" />
                )}
              </button>
              {isOpen && (
                <div className="ml-4 mt-1 border-l border-slate-200 pl-2 space-y-1">
                  {entry.children.map((item) => {
                    const itemActive = item.key === activeKey;
                    return (
                      <NavLink
                        key={item.key}
                        to={item.path}
                        onClick={onClose}
                        className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                          itemActive
                            ? "bg-primary text-white"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                      >
                        {item.title}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition hover:bg-slate-100"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-900">
              {user?.names ?? "Usuario"}
            </p>
            <p className="truncate text-[10px] text-slate-500">
              {user?.role ? roleLabels[user.role] : ""}
            </p>
          </div>
          <LogOut className="size-4 shrink-0 text-slate-400" />
        </button>
      </div>
    </aside>
  );
};
