import * as Yup from "yup";
export const qssSchema = Yup.object({ scale: Yup.number().min(1).required("La escala es obligatoria"), sublevel: Yup.number().min(1).required("El subnivel es obligatorio"), is_active: Yup.boolean() });
