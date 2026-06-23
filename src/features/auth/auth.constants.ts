export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Credenciales inválidas",
  NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
  SESSION_EXPIRED: "Tu sesión ha expirado. Inicia sesión nuevamente.",
  REGISTRATION_FAILED: "No se pudo registrar el usuario",
  UNKNOWN_ERROR: "Ocurrió un error inesperado",
} as const;

export const AUTH_TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
  USER: "auth_user",
} as const;

export const AUTH_ROUTES = { LOGIN: "/login", HOME: "/" } as const;
export const AUTH_BASE_URL = "/api/iam";

export const AUTH_ENDPOINTS = {
  LOGIN: `${AUTH_BASE_URL}/login/`,
  REFRESH: `${AUTH_BASE_URL}/refresh/`,
  LOGOUT: `${AUTH_BASE_URL}/logout/`,
} as const;

export const UserRoleEnum = {
  STUDENT: "ESTUDIANTE",
  REPRESENTATIVE: "REPRESENTANTE",
  TEACHER: "DOCENTE",
  DIRECTOR: "DIRECTOR",
  RECTOR: "RECTOR",
  COUNSELOR: "DECE",
} as const;

export const AUTH_PERMISSIONS = {
  VIEW_USERS: "iam.view_user",
  CREATE_USERS: "iam.create_user",
  EDIT_USERS: "iam.edit_user",
  DELETE_USERS: "iam.delete_user",
  VIEW_ROLES: "iam.view_role",
  CREATE_ROLES: "iam.create_role",
  EDIT_ROLES: "iam.edit_role",
  DELETE_ROLES: "iam.delete_role",
  VIEW_PERMISSIONS: "iam.view_permission",
  CREATE_PERMISSIONS: "iam.create_permission",
  EDIT_PERMISSIONS: "iam.edit_permission",
  DELETE_PERMISSIONS: "iam.delete_permission",
} as const;
