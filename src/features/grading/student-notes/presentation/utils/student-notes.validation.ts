import * as Yup from "yup";

export const studentNoteSchema = Yup.object({
  numeric_score: Yup.number().min(0).max(10).nullable(),
  manually_overridden: Yup.boolean(),
  teacher_observation: Yup.string().nullable(),
  sync_status: Yup.string().oneOf(["PENDIENTE", "SINCRONIZADO", "ERROR"]),
  enrollment: Yup.number().nullable(),
  evaluative_activity: Yup.number().nullable(),
  grade_type: Yup.number().nullable(),
  qualitative_scale: Yup.number().nullable(),
});
