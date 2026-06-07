import { useEffect } from "react";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { useCustomFormik } from "@shared/hooks/useCustomFormik";
import { useAcademicSubnivelForm } from "../../presentation/hooks/useAcademicSubnivelForm";
import { academicSubnivelSchema } from "../../presentation/utils/academic-subnivel.validation";
import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";

interface AcademicSubnivelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSubnivel?: AcademicSubnivelT | null;
  academicLevels?: { label: string; value: string }[];
}

export const AcademicSubnivelFormModal = ({
  isOpen,
  onClose,
  editingSubnivel,
  academicLevels = [],
}: AcademicSubnivelFormModalProps) => {
  const { handleSubmit } = useAcademicSubnivelForm();

  const formik = useCustomFormik({
    initialValues: {
      code: editingSubnivel?.code ?? "",
      name: editingSubnivel?.name ?? "",
      description: editingSubnivel?.description ?? "",
      order: editingSubnivel?.order ?? 0,
      academic_level: editingSubnivel?.academic_level ?? 0,
      is_active: editingSubnivel?.is_active ?? true,
    },
    validationSchema: academicSubnivelSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await handleSubmit(values);
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          code: editingSubnivel?.code ?? "",
          name: editingSubnivel?.name ?? "",
          description: editingSubnivel?.description ?? "",
          order: editingSubnivel?.order ?? 0,
          academic_level: editingSubnivel?.academic_level ?? 0,
          is_active: editingSubnivel?.is_active ?? true,
        },
      });
    }
  }, [isOpen, editingSubnivel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4">
          {editingSubnivel ? "Editar Subnivel" : "Nuevo Subnivel"}
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <CustomInput
            label="Código"
            name="code"
            type="text"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code ? formik.errors.code : undefined}
          />
          <CustomInput
            label="Nombre"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name ? formik.errors.name : undefined}
          />
          <CustomInput
            label="Descripción"
            name="description"
            type="text"
            value={formik.values.description ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <CustomInput
            label="Orden"
            name="order"
            type="number"
            value={formik.values.order}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.order ? formik.errors.order : undefined}
          />
          <CustomSelect
            label="Nivel Académico"
            name="academic_level"
            value={String(formik.values.academic_level)}
            onChange={(option) => formik.setFieldValue("academic_level", Number(option.value))}
            options={academicLevels}
            error={formik.touched.academic_level ? formik.errors.academic_level : undefined}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formik.values.is_active}
              onChange={(e) => formik.setFieldValue("is_active", e.target.checked)}
            />
            <label htmlFor="is_active">Activo</label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={formik.isSubmitting}>
              {editingSubnivel ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
