import * as Yup from "yup";

const todayStr = new Date().toISOString().split("T")[0];

export const schoolYearSchema = Yup.object({
  start_date: Yup.string()
    .required("La fecha de inicio es obligatoria")
    .test(
      "start_date_after_today",
      "La fecha de inicio no puede ser anterior a la fecha actual",
      function (value) {
        return value >= todayStr;
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
