import * as Yup from "yup";

export const academicGradeSchema = Yup.object({
  code: Yup.string().max(50),
  name: Yup.string().min(1).required("El nombre es obligatorio"),
  academic_sublevel: Yup.number().required("El nivel académico es obligatorio"),
});
