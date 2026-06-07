import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { CustomInput } from "@shared/components/Form";

import { representativeSchema } from "../helpers/representative.helpers";

import type { RepresentativeFormValues } from "../helpers/representative.helpers";

type RepresentativeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RepresentativeFormValues) => Promise<void>;
  initialValues?: RepresentativeFormValues;
  isEdit?: boolean;
};

export function RepresentativeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isEdit,
}: RepresentativeFormModalProps) {
  const formik = useFormik<RepresentativeFormValues>({
    initialValues: initialValues ?? {
      dni: "",
      names: "",
      last_names: "",
      phone: "",
      email: null,
      address: null,
    },
    validationSchema: representativeSchema,
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
            {isEdit ? "Editar Representante" : "Nuevo Representante"}
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
            placeholder="Maria Jose"
            value={formik.values.names}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.names ? formik.errors.names : undefined}
          />

          <CustomInput
            label="Apellidos"
            name="last_names"
            placeholder="Garcia Lopez"
            value={formik.values.last_names}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={
              formik.touched.last_names ? formik.errors.last_names : undefined
            }
          />

          <CustomInput
            label="Telefono"
            name="phone"
            placeholder="0991234567"
            value={formik.values.phone}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.phone ? formik.errors.phone : undefined}
          />

          <CustomInput
            label="Email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formik.values.email ?? ""}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.email ? formik.errors.email : undefined}
          />

          <CustomInput
            label="Direccion"
            name="address"
            placeholder="Calle Principal 123"
            value={formik.values.address ?? ""}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.address ? formik.errors.address : undefined}
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
