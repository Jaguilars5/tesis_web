import * as Yup from "yup";

import { WEIGHT_MAX, WEIGHT_MIN, WEIGHT_SUM } from "./scoring-config.constants";
import type {
  RiskScoringConfigT,
  ScoringConfigFormValues,
} from "./scoring-config.types";

export const toFormValues = (
  config: RiskScoringConfigT,
): ScoringConfigFormValues => ({
  engine: config.engine,
  weight_conducta: config.weight_conducta,
  weight_asistencia: config.weight_asistencia,
  weight_calificaciones: config.weight_calificaciones,
  attendance_red_max: config.attendance_red_max,
  attendance_yellow_max: config.attendance_yellow_max,
  average_red_max: config.average_red_max,
  average_yellow_max: config.average_yellow_max,
  severe_red_min: config.severe_red_min,
  mild_yellow_min: config.mild_yellow_min,
});

export const weightSum = (values: {
  weight_conducta: number;
  weight_asistencia: number;
  weight_calificaciones: number;
}): number =>
  Number(
    (
      Number(values.weight_conducta || 0) +
      Number(values.weight_asistencia || 0) +
      Number(values.weight_calificaciones || 0)
    ).toFixed(2),
  );

const weightField = (label: string) =>
  Yup.number()
    .typeError(`${label} debe ser un número`)
    .required(`${label} es obligatorio`)
    .min(WEIGHT_MIN, `${label} debe ser al menos ${WEIGHT_MIN}%`)
    .max(WEIGHT_MAX, `${label} no puede superar ${WEIGHT_MAX}%`);

export const scoringConfigSchema = Yup.object({
  engine: Yup.string().oneOf(["reglas", "ML"]).required(),
  weight_conducta: weightField("El peso de conducta"),
  weight_asistencia: weightField("El peso de asistencia"),
  weight_calificaciones: weightField("El peso de calificaciones"),
  attendance_red_max: Yup.number()
    .typeError("Debe ser un número")
    .required("Obligatorio")
    .min(0, "Mínimo 0")
    .max(100, "Máximo 100"),
  attendance_yellow_max: Yup.number()
    .typeError("Debe ser un número")
    .required("Obligatorio")
    .min(0, "Mínimo 0")
    .max(100, "Máximo 100")
    .test(
      "attendance-coherence",
      "El umbral rojo debe ser menor que el amarillo",
      function (value) {
        const { attendance_red_max } = this.parent;
        return value == null || attendance_red_max == null
          ? true
          : attendance_red_max < value;
      },
    ),
  average_red_max: Yup.number()
    .typeError("Debe ser un número")
    .required("Obligatorio")
    .min(0, "Mínimo 0")
    .max(10, "Máximo 10"),
  average_yellow_max: Yup.number()
    .typeError("Debe ser un número")
    .required("Obligatorio")
    .min(0, "Mínimo 0")
    .max(10, "Máximo 10")
    .test(
      "average-coherence",
      "El umbral rojo debe ser menor que el amarillo",
      function (value) {
        const { average_red_max } = this.parent;
        return value == null || average_red_max == null
          ? true
          : average_red_max < value;
      },
    ),
  severe_red_min: Yup.number()
    .typeError("Debe ser un número entero")
    .integer("Debe ser un número entero")
    .required("Obligatorio")
    .min(1, "Mínimo 1"),
  mild_yellow_min: Yup.number()
    .typeError("Debe ser un número entero")
    .integer("Debe ser un número entero")
    .required("Obligatorio")
    .min(1, "Mínimo 1"),
}).test(
  "weights-sum-100",
  `Los pesos deben sumar ${WEIGHT_SUM}%`,
  function (values) {
    if (!values) return true;
    const sum = weightSum(values);
    if (Math.abs(sum - WEIGHT_SUM) <= 0.01) return true;
    return this.createError({
      path: "weight_calificaciones",
      message: `Los pesos deben sumar ${WEIGHT_SUM}% (actual: ${sum}%)`,
    });
  },
);
