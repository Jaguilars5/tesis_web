import * as Yup from "yup";

export const loginSchema = Yup.object({
  username: Yup.string()
    .required("El usuario es obligatorio"),
  password: Yup.string()
    .required("La contraseña es obligatoria"),
});

export const profileSchema = Yup.object({
  name: Yup.string()
    .min(3, "Ingresa al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  email: Yup.string()
    .email("Ingresa un correo valido")
    .required("El correo es obligatorio"),
  role: Yup.string().required("El rol es obligatorio"),
});
