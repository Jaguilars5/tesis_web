import * as Yup from "yup";
export const schoolYearSchema = Yup.object({
  start_date: Yup.string()
    .required("La fecha de inicio es obligatoria")
    .test(
      "start_date_after_today",
      "La fecha de inicio no puede ser anterior a la fecha actual",
      function (value) {
        return value >= new Date().toISOString();
      },
    ),
  end_date: Yup.string()
    .required("La fecha de fin es obligatoria")
    .test(
      "end_date_after_start_date",
      "La fecha de fin no puede ser anterior a la fecha de inicio",
      function (value) {
        const { start_date } = this.parent as { start_date?: string };
        if (!value || !start_date) return true;
        return value >= start_date;
      },
    ),
  is_active: Yup.boolean(),
});
