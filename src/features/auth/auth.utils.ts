import * as Yup from "yup";
import type { AuthUserT } from "./auth.types";

export const loginSchema = Yup.object({
  username: Yup.string().required("El usuario es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria"),
});

export const profileSchema = Yup.object({
  name: Yup.string().min(3, "Ingresa al menos 3 caracteres").required("El nombre es obligatorio"),
  email: Yup.string().email("Ingresa un correo valido").required("El correo es obligatorio"),
  role: Yup.string().required("El rol es obligatorio"),
});

export const validateUsername = (username: string): string | null => {
  if (!username.trim()) return "El usuario es obligatorio";
  if (username.length < 3) return "El usuario debe tener al menos 3 caracteres";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "La contraseña es obligatoria";
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  return null;
};

export const isAuthenticated = (user: AuthUserT | null): boolean => user !== null;
export const getUserDisplayName = (user: AuthUserT): string => `${user.names} ${user.last_names}`.trim();
export const getUserInitials = (user: AuthUserT): string => `${user.names.charAt(0).toUpperCase()}${user.last_names.charAt(0).toUpperCase()}`;
