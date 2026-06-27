import { useFormik } from "formik";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  checkboxClassname,
  inputClassname,
  selectClassname,
} from "@app/styles/styles";
import {
  CustomCheckbox,
  CustomInput,
  CustomSelect,
} from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import { usePeriodTypeList } from "../hooks/usePeriodTypeOptions";
import {
  academicPeriodSchema,
  buildAbbreviation,
} from "../academic-period.utils";
import { AcademicPeriodCard } from "./AcademicPeriodCard";

import type { PeriodTypeT } from "@features/academic/period-types/period-types.types";
import type {
  AcademicPeriodCreateParamsT,
  AcademicPeriodFormValues,
  AcademicPeriodT,
} from "../academic-period.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    school_year: "Año escolar",
    period_type: "Tipo de período",
    start_date: "Fecha de inicio",
    end_date: "Fecha de fin",
    year_weight: "Peso del año",
    name: "Nombre",
    code: "Código",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface AcademicPeriodFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingAcademicPeriod: AcademicPeriodT | null;
  periodTypeOptions: { label: string; value: string }[];
  schoolYearOptions: { label: string; value: string }[];
  submitErrors: SubmitErrorState;
  onCreateMany: (items: AcademicPeriodCreateParamsT[]) => Promise<void>;
  onUpdate: (values: AcademicPeriodFormValues) => Promise<void>;
}

const buildInitialCards = (
  type: PeriodTypeT,
  schoolYearId: number,
): AcademicPeriodFormValues[] => {
  const divisions = Math.max(1, type.divisions_per_year);
  const weight = Number((100 / divisions).toFixed(2));
  const abbrev = buildAbbreviation(type.name);
  return Array.from({ length: divisions }, (_, i) => {
    const seq = i + 1;
    return {
      code: `${abbrev}${seq}`,
      name: `${type.name} ${seq}`,
      period_type: type.id,
      start_date: "",
      end_date: "",
      year_weight: weight,
      is_regular_period: true,
      school_year: schoolYearId,
      is_active: true,
    };
  });
};

const buildEditInitialValues = (
  item: AcademicPeriodT | null,
): AcademicPeriodFormValues => {
  if (!item) {
    return {
      code: "",
      name: "",
      period_type: 0,
      start_date: "",
      end_date: "",
      year_weight: null,
      is_regular_period: true,
      school_year: 0,
      is_active: true,
    };
  }
  return {
    code: item.code,
    name: item.name,
    period_type: item.period_type ?? 0,
    start_date: item.start_date,
    end_date: item.end_date,
    year_weight: item.year_weight,
    is_regular_period: item.is_regular_period,
    school_year: item.school_year,
    is_active: item.is_active,
  };
};

export const AcademicPeriodFormModal: React.FC<
  AcademicPeriodFormModalProps
> = ({
  isOpen,
  onClose,
  isEdit,
  editingAcademicPeriod,
  periodTypeOptions,
  schoolYearOptions,
  submitErrors,
  onCreateMany,
  onUpdate,
}) => {
  const { periodTypes } = usePeriodTypeList();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<number | null>(
    null,
  );
  const [selectedPeriodType, setSelectedPeriodType] = useState<number | null>(
    null,
  );
  const [cards, setCards] = useState<AcademicPeriodFormValues[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weightError, setWeightError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const totalWeight = useMemo(
    () =>
      cards.reduce(
        (acc, c) =>
          acc + (typeof c.year_weight === "number" ? c.year_weight : 0),
        0,
      ),
    [cards],
  );
  const isWeightValid = useMemo(
    () => Math.abs(totalWeight - 100) < 0.01,
    [totalWeight],
  );

  const selectedType: PeriodTypeT | undefined = useMemo(
    () => periodTypes.find((p) => p.id === selectedPeriodType),
    [periodTypes, selectedPeriodType],
  );

  const editFormik = useFormik<AcademicPeriodFormValues>({
    initialValues: buildEditInitialValues(editingAcademicPeriod),
    enableReinitialize: true,
    validationSchema: academicPeriodSchema,
    onSubmit: () => undefined,
  });

  const canGoNext = selectedSchoolYear != null && selectedPeriodType != null;

  const handleClose = () => {
    setStep(1);
    setSelectedSchoolYear(null);
    setSelectedPeriodType(null);
    setCards([]);
    onClose();
  };

  const goToStepTwo = () => {
    if (!canGoNext || !selectedType) return;
    setCards(buildInitialCards(selectedType, selectedSchoolYear as number));
    setStep(2);
  };

  const goToStepOne = () => {
    setStep(1);
  };

  const handleUpdateSubmit = useCallback(async () => {
    if (submittingRef.current) return;

    // Validación manual de campos requeridos
    const values = editFormik.values;
    const validationErrors: string[] = [];

    if (!values.name?.trim()) {
      validationErrors.push("El nombre es obligatorio");
    }
    if (!values.code?.trim()) {
      validationErrors.push("El código es obligatorio");
    }
    if (!values.start_date) {
      validationErrors.push("La fecha de inicio es obligatoria");
    }
    if (!values.end_date) {
      validationErrors.push("La fecha de fin es obligatoria");
    }
    if (
      values.start_date &&
      values.end_date &&
      values.end_date < values.start_date
    ) {
      validationErrors.push(
        "La fecha de fin no puede ser anterior a la fecha de inicio",
      );
    }
    if (values.year_weight == null || values.year_weight === 0) {
      validationErrors.push("El peso es obligatorio");
    }
    if (!values.school_year || values.school_year === 0) {
      validationErrors.push("Debe seleccionar un año escolar");
    }

    if (validationErrors.length > 0) {
      setWeightError(validationErrors.join(". "));
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await onUpdate(values);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [editFormik, onUpdate]);

  const handleCreateSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    if (!isWeightValid) {
      setWeightError(
        `La suma de los pesos debe ser exactamente 100% (actual: ${totalWeight}%).`,
      );
      return;
    }
    setWeightError(null);

    // Validación manual de campos requeridos
    const validationErrors: string[] = [];
    cards.forEach((card, index) => {
      const cardNum = index + 1;
      if (!card.name?.trim()) {
        validationErrors.push(`Periodo ${cardNum}: El nombre es obligatorio`);
      }
      if (!card.code?.trim()) {
        validationErrors.push(`Periodo ${cardNum}: El código es obligatorio`);
      }
      if (!card.start_date) {
        validationErrors.push(
          `Periodo ${cardNum}: La fecha de inicio es obligatoria`,
        );
      }
      if (!card.end_date) {
        validationErrors.push(
          `Periodo ${cardNum}: La fecha de fin es obligatoria`,
        );
      }
      if (card.start_date && card.end_date && card.end_date < card.start_date) {
        validationErrors.push(
          `Periodo ${cardNum}: La fecha de fin no puede ser anterior a la fecha de inicio`,
        );
      }
      if (card.year_weight == null || card.year_weight === 0) {
        validationErrors.push(`Periodo ${cardNum}: El peso es obligatorio`);
      }
    });

    if (validationErrors.length > 0) {
      setWeightError(validationErrors.join(". "));
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await onCreateMany(cards);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [cards, isWeightValid, onCreateMany, totalWeight]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isSubmitting ? undefined : handleClose}
      />
      <div
        className={`relative w-full ${
          isEdit ? "max-w-md" : "max-w-3xl"
        } animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit
                ? "Editar Periodo Academico"
                : step === 1
                  ? "Nuevo Periodo Academico"
                  : "Confirmar Periodos"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit
                ? "Modifique los datos del periodo"
                : step === 1
                  ? "Seleccione el ano escolar y el tipo de periodo"
                  : "Complete las fechas de cada periodo generado"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {!isEdit && (
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/60 px-5 py-2 text-xs">
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
                step === 1
                  ? "bg-primary text-white"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {step > 1 ? <Check className="size-3" /> : "1"} Configuracion
            </span>
            <ChevronRight className="size-3 text-slate-300" />
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
                step === 2
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              2 Periodos generados
            </span>
          </div>
        )}

        {(submitErrors.general.length > 0 ||
          Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
        )}

        {isEdit ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleUpdateSubmit();
            }}
            className="space-y-4 p-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Nombre del Periodo"
                name="name"
                value={editFormik.values.name}
                onBlur={editFormik.handleBlur}
                onChange={editFormik.handleChange}
                type="text"
                error={
                  editFormik.touched.name ? editFormik.errors.name : undefined
                }
                className={inputClassname}
                disabled={isSubmitting}
              />
              <CustomInput
                label="Codigo"
                name="code"
                value={editFormik.values.code}
                onBlur={editFormik.handleBlur}
                onChange={editFormik.handleChange}
                type="text"
                error={
                  editFormik.touched.code ? editFormik.errors.code : undefined
                }
                className={inputClassname}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomSelect
                label="Tipo de Periodo"
                name="period_type"
                value={String(editFormik.values.period_type)}
                onBlur={editFormik.handleBlur}
                onChange={(option) =>
                  editFormik.setFieldValue("period_type", Number(option.value))
                }
                error={
                  editFormik.touched.period_type
                    ? editFormik.errors.period_type
                    : undefined
                }
                options={periodTypeOptions}
                className={selectClassname}
                disabled
              />
              <CustomSelect
                label="Año Escolar"
                name="school_year"
                value={String(editFormik.values.school_year)}
                onBlur={editFormik.handleBlur}
                onChange={(option) =>
                  editFormik.setFieldValue("school_year", Number(option.value))
                }
                error={
                  editFormik.touched.school_year
                    ? editFormik.errors.school_year
                    : undefined
                }
                options={schoolYearOptions}
                className={selectClassname}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Fecha de Inicio"
                name="start_date"
                type="date"
                value={editFormik.values.start_date}
                onBlur={editFormik.handleBlur}
                onChange={editFormik.handleChange}
                error={
                  editFormik.touched.start_date
                    ? editFormik.errors.start_date
                    : undefined
                }
                className={inputClassname}
                disabled={isSubmitting}
              />
              <CustomInput
                label="Fecha de Fin"
                name="end_date"
                type="date"
                min={editFormik.values.start_date}
                value={editFormik.values.end_date}
                onBlur={editFormik.handleBlur}
                onChange={editFormik.handleChange}
                error={
                  editFormik.touched.end_date
                    ? editFormik.errors.end_date
                    : undefined
                }
                className={inputClassname}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Peso en el año (%)"
                name="year_weight"
                type="number"
                value={editFormik.values.year_weight ?? ""}
                onBlur={editFormik.handleBlur}
                onChange={editFormik.handleChange}
                error={
                  editFormik.touched.year_weight
                    ? editFormik.errors.year_weight
                    : undefined
                }
                className={inputClassname}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center gap-6 pb-1">
              <CustomCheckbox
                name="is_regular_period"
                checked={editFormik.values.is_regular_period}
                onChange={(e) =>
                  editFormik.setFieldValue(
                    "is_regular_period",
                    e.target.checked,
                  )
                }
                onBlur={editFormik.handleBlur}
                label="Periodo Regular"
                className={checkboxClassname}
                disabled={isSubmitting}
              />
              {isEdit && (
                <CustomCheckbox
                  name="is_active"
                  checked={editFormik.values.is_active}
                  onChange={(e) =>
                    editFormik.setFieldValue(
                      "is_active",
                      e.target.checked,
                    )
                  }
                  onBlur={editFormik.handleBlur}
                  label="Activo"
                  className={checkboxClassname}
                  disabled={isSubmitting}
                />
              )}
            </div>

            {weightError && (
              <div className="rounded-md border border-red-200 bg-red-50/70 px-3 py-2 text-xs text-red-700">
                {weightError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </form>
        ) : step === 1 ? (
          <div className="space-y-4 p-5">
            <CustomSelect
              label="Año Escolar"
              name="school_year"
              value={
                selectedSchoolYear != null ? String(selectedSchoolYear) : ""
              }
              onChange={(option) => setSelectedSchoolYear(Number(option.value))}
              options={schoolYearOptions}
              className={selectClassname}
              disabled={isSubmitting}
            />
            <CustomSelect
              label="Tipo de Periodo"
              name="period_type"
              value={
                selectedPeriodType != null ? String(selectedPeriodType) : ""
              }
              onChange={(option) => setSelectedPeriodType(Number(option.value))}
              options={periodTypeOptions}
              className={selectClassname}
              disabled={isSubmitting}
            />

            {selectedType && (
              <div className="rounded-md border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs text-blue-800">
                Se generaran{" "}
                <span className="font-semibold">
                  {selectedType.divisions_per_year}
                </span>{" "}
                periodos con peso de{" "}
                <span className="font-semibold">
                  {Number(
                    (
                      100 / Math.max(1, selectedType.divisions_per_year)
                    ).toFixed(2),
                  )}
                  %
                </span>{" "}
                cada uno.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={goToStepTwo}
                disabled={!canGoNext || isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continuar
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-5">
            <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {cards.map((card, idx) => (
                <AcademicPeriodCard
                  key={`${card.code}-${idx}`}
                  index={idx}
                  total={cards.length}
                  initialValues={card}
                  disabled={isSubmitting}
                  onChange={(values) =>
                    setCards((prev) =>
                      prev.map((c, i) => (i === idx ? values : c)),
                    )
                  }
                />
              ))}
            </div>

            <div
              className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-xs ${
                isWeightValid
                  ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
                  : "border-amber-200 bg-amber-50/60 text-amber-800"
              }`}
            >
              <span>
                Suma de pesos:{" "}
                <span className="font-semibold">{totalWeight.toFixed(2)}%</span>{" "}
                / 100%
              </span>
              <span className="font-medium">
                {isWeightValid ? "Distribucion valida" : "Debe sumar 100%"}
              </span>
            </div>

            {weightError && (
              <div className="rounded-md border border-red-200 bg-red-50/70 px-3 py-2 text-xs text-red-700">
                {weightError}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={goToStepOne}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft className="size-4" />
                Atras
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => void handleCreateSubmit()}
                  disabled={isSubmitting || !isWeightValid}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Guardando...
                    </>
                  ) : (
                    `Crear ${cards.length} periodo${cards.length === 1 ? "" : "s"}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
