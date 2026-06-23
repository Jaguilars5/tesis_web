import * as Yup from "yup";

import type { AuthUserT } from "@features/auth/auth.types";

export const profileSchema = Yup.object({
  names: Yup.string()
    .min(2, "Ingresa al menos 2 caracteres")
    .required("El nombre es obligatorio"),
  last_names: Yup.string()
    .min(2, "Ingresa al menos 2 caracteres")
    .required("Los apellidos son obligatorios"),
  email: Yup.string()
    .email("Ingresa un correo válido")
    .required("El correo es obligatorio"),
});

export const formatProfileName = (user: AuthUserT): string =>
  `${user.names} ${user.last_names}`.trim();
