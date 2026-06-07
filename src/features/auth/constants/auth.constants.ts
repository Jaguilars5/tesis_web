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

export const AUTH_ROUTES = {
  LOGIN: "/login",
  HOME: "/",
} as const;

export const AUTH_BASE_URL = "/api/iam";

export const AUTH_ENDPOINTS = {
  LOGIN: `${AUTH_BASE_URL}/login/`,
  REFRESH: `${AUTH_BASE_URL}/refresh/`,
  LOGOUT: `${AUTH_BASE_URL}/logout/`,
} as const;

export const AUTH_THUNK_PREFIX = "auth";

export const AUTH_THUNKS = {
  LOGIN: `${AUTH_THUNK_PREFIX}/login`,
  LOGOUT: `${AUTH_THUNK_PREFIX}/logout`,
  REFRESH_SESSION: `${AUTH_THUNK_PREFIX}/refreshSession`,
};

export const UserRoleEnum = {
  STUDENT: "ESTUDIANTE",
  REPRESENTATIVE: "REPRESENTANTE",
  TEACHER: "DOCENTE",
  DIRECTOR: "DIRECTOR",
  RECTOR: "RECTOR",
  COUNSELOR: "DECE",
} as const;
