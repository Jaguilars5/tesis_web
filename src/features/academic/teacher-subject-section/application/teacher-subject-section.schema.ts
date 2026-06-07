import * as Yup from "yup";

export const teacherSubjectSectionSchema = Yup.object({
  user: Yup.number().required("El docente es obligatorio"),
  subject_offering: Yup.number().required("La oferta de materia es obligatoria"),
  is_active: Yup.boolean(),
});

export type TeacherSubjectSectionFormValues = {
  user: number;
  subject_offering: number;
  is_active: boolean;
};
