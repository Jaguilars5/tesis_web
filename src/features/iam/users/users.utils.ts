import * as Yup from "yup";

export const userCreateSchema = Yup.object({
  document_number: Yup.string()
    .required("El número de documento es obligatorio")
    .max(20, "No debe exceder 20 caracteres"),
  names: Yup.string()
    .required("Los nombres son obligatorios")
    .max(100, "No debe exceder 100 caracteres"),
  last_names: Yup.string()
    .required("Los apellidos son obligatorios")
    .max(100, "No debe exceder 100 caracteres"),
  email: Yup.string()
    .email("Debe ser un email válido")
    .required("El email es obligatorio")
    .max(254, "No debe exceder 254 caracteres"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  role_id: Yup.number()
    .min(1, "Debe seleccionar un rol")
    .required("El rol es obligatorio"),
});

export const userEditSchema = Yup.object({
  email: Yup.string()
    .email("Debe ser un email válido")
    .required("El email es obligatorio")
    .max(254, "No debe exceder 254 caracteres"),
  role_id: Yup.number()
    .min(1, "Debe seleccionar un rol")
    .required("El rol es obligatorio"),
});

export const changePasswordSchema = Yup.object({
  new_password: Yup.string()
    .required("La nueva contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});
