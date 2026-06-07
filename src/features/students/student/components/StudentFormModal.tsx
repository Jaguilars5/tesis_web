import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { CustomInput, CustomSelect } from "@shared/components/Form";

import { studentSchema } from "../helpers/student.helpers";

import type { SectionT } from "@features/institutions/section/domain/entities/section.types";
import type { StudentFormValues } from "../helpers/student.helpers";

type StudentFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: StudentFormValues) => Promise<void>;
  initialValues?: StudentFormValues;
  isEdit?: boolean;
  sections: SectionT[];
};

export function StudentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isEdit,
  sections,
}: StudentFormModalProps) {
  const formik = useFormik<StudentFormValues>({
    initialValues: initialValues ?? {
      dni: "",
      names: "",
      last_names: "",
      birth_date: "",
      section: 0,
      enrollment_number: null,
    },
    validationSchema: studentSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  useEffect(() => {
    if (isOpen && initialValues) {
      formik.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const sectionOptions = sections.map((s) => ({
    label: `Paralelo ${s.parallel}`,
    value: String(s.id),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-white rounded-xl shadow-modal w-full max-w-md overflow-hidden animate-slide-up"
      >
        <div
          className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4"
        >
          <h3 className="text-lg font-extrabold text-slate-800">
            {isEdit ? "Editar Estudiante" : "Nuevo Estudiante"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="p-5 space-y-4"
        >
          <CustomInput
            label="Cedula"
            name="dni"
            placeholder="1234567890"
            value={formik.values.dni}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.dni ? formik.errors.dni : undefined}
          />

          <CustomInput
            label="Nombres"
            name="names"
            placeholder="Juan Carlos"
            value={formik.values.names}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.names ? formik.errors.names : undefined}
          />

          <CustomInput
            label="Apellidos"
            name="last_names"
            placeholder="Perez Lopez"
            value={formik.values.last_names}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={
              formik.touched.last_names ? formik.errors.last_names : undefined
            }
          />

          <CustomInput
            label="Fecha de Nacimiento"
            name="birth_date"
            type="date"
            value={formik.values.birth_date}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={
              formik.touched.birth_date ? formik.errors.birth_date : undefined
            }
          />

          <CustomSelect
            label="Seccion"
            name="section"
            value={String(formik.values.section)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={sectionOptions}
            error={formik.touched.section ? formik.errors.section : undefined}
          />

          <CustomInput
            label="No. Matricula"
            name="enrollment_number"
            placeholder="MAT-2025-001"
            value={formik.values.enrollment_number ?? ""}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={
              formik.touched.enrollment_number
                ? formik.errors.enrollment_number
                : undefined
            }
          />

          <div
            className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4"
          >
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-bold gap-2 px-4 py-2.5 transition hover:bg-indigo-50 hover:border-primary hover:text-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="inline-flex items-center justify-center text-white bg-primary rounded-lg text-sm font-bold gap-2 px-4 py-2.5 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="size-5 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
