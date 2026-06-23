import * as Yup from "yup";
export const academicGradeValidationSchema = Yup.object({ code: Yup.string().max(50), name: Yup.string().min(1).required("El nombre es obligatorio"), academic_sublevel: Yup.number().nullable(), is_active: Yup.boolean() });
