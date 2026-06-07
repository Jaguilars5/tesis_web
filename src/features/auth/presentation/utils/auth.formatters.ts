import type { AuthUserT } from "../../domain/entities/auth.types";

export const isAuthenticated = (user: AuthUserT | null): boolean => {
  return user !== null;
};

export const getUserDisplayName = (user: AuthUserT): string => {
  return `${user.names} ${user.last_names}`.trim();
};

export const getUserInitials = (user: AuthUserT): string => {
  const first = user.names.charAt(0).toUpperCase();
  const last = user.last_names.charAt(0).toUpperCase();
  return `${first}${last}`;
};
