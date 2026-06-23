import * as Yup from "yup";

export const attendanceSchema = Yup.object({
  enrollment: Yup.number().required("La matrícula es requerida").typeError("Seleccione una matrícula"),
  teacher_subject_section: Yup.number().required("La clase es requerida").typeError("Seleccione una clase"),
  academic_period: Yup.number().required("El período académico es requerido").typeError("Seleccione un período"),
  attendance_status: Yup.number().required("El estado es requerido").typeError("Seleccione un estado"),
  absence_type: Yup.number().nullable().typeError("Seleccione un tipo de ausencia"),
  attendance_date: Yup.string().required("La fecha es requerida"),
  observation: Yup.string(),
});
