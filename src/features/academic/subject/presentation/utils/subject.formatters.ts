import * as Yup from "yup";

export const subjectSchema = Yup.object({
  school_year: Yup.number().min(1, "Año escolar requerido").required(),
  section: Yup.number().min(1, "Sección requerida").required(),
  name: Yup.string().required("Nombre requerido"),
  code: Yup.string().required("Código requerido"),
  weekly_hours: Yup.number()
    .min(1, "Debe tener al menos 1 hora semanal")
    .required(),
  approve_percentage: Yup.number()
    .min(1)
    .required("Porcentaje de aprobación requerido"),
  is_active: Yup.boolean(),
});

export type SubjectFormValues = {
  school_year: number;
  section: number;
  name: string;
  code: string;
  weekly_hours: number;
  approve_percentage: number;
  is_active: boolean;
};
