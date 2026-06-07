import * as Yup from "yup";

export const studentSchema = Yup.object({
  dni: Yup.string().required("Cedula requerida"),
  names: Yup.string().required("Nombres requeridos"),
  last_names: Yup.string().required("Apellidos requeridos"),
  birth_date: Yup.string().required("Fecha de nacimiento requerida"),
  section: Yup.number().min(1, "Seccion requerida").required(),
  enrollment_number: Yup.string().nullable(),
});

export type StudentFormValues = {
  dni: string;
  names: string;
  last_names: string;
  birth_date: string;
  section: number;
  enrollment_number: string | null;
};
