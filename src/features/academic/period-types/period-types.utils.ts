import * as Yup from "yup";

export const periodTypeSchema = Yup.object({
  code: Yup.string()
    .min(1, "El codigo debe tener al menos 1 caracter")
    .max(20, "El codigo no debe exceder 20 caracteres")
    .required("El codigo es obligatorio"),
  name: Yup.string()
    .min(1, "El nombre debe tener al menos 1 caracter")
    .max(100, "El nombre no debe exceder 100 caracteres")
    .required("El nombre es obligatorio"),
  description: Yup.string().nullable(),
  divisions_per_year: Yup.number()
    .typeError("Las divisiones por ano deben ser un numero")
    .integer("Las divisiones por ano deben ser un numero entero")
    .min(1, "Debe existir al menos 1 division por ano")
    .max(12, "No puede haber mas de 12 divisiones por ano")
    .required("Las divisiones por ano son obligatorias"),
  is_active: Yup.boolean(),
});
