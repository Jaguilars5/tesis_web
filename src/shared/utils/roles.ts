import type { UserRoleT } from "../../features/auth/domain/entities/auth.types";

interface RolePermissions {
  modules: string[];
  excludedItems?: string[];
}

const rolePermissions: Record<UserRoleT, RolePermissions> = {
  ESTUDIANTE: {
    modules: ["dashboard", "academico", "calificaciones"],
    excludedItems: [
      "academic-config",
      "timing-regimes",
      "activities",
      "teacher-assignments",
      "conduct",
      "notes",
    ],
  },
  REPRESENTANTE: {
    modules: ["dashboard", "academico", "calificaciones"],
    excludedItems: [
      "academic-config",
      "timing-regimes",
      "activities",
      "teacher-assignments",
      "conduct",
      "notes",
    ],
  },
  DOCENTE: {
    modules: ["dashboard", "academico", "horarios", "calificaciones"],
    excludedItems: ["academic-config", "activities"],
  },
  DIRECTOR: {
    modules: [
      "dashboard",
      "institutions",
      "infraestructura",
      "academico",
      "horarios",
      "calificaciones",
      "cuentas",
    ],
    excludedItems: [],
  },
  RECTOR: {
    modules: ["dashboard"],
    excludedItems: [],
  },
  DECE: {
    modules: ["dashboard", "infraestructura", "calificaciones"],
    excludedItems: ["attendance", "notes"],
  },
};

export const roleLabels: Record<UserRoleT, string> = {
  ESTUDIANTE: "Estudiante",
  REPRESENTANTE: "Representante",
  DOCENTE: "Docente",
  DIRECTOR: "Director",
  RECTOR: "Rector",
  DECE: "Consejero DECE",
};

export function hasModuleAccess(role: UserRoleT, moduleKey: string): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  return permissions.modules.includes(moduleKey);
}

export function hasItemAccess(role: UserRoleT, itemKey: string): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  if (permissions.excludedItems?.includes(itemKey)) return false;
  return true;
}
