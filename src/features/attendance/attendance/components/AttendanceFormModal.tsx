import { useFormik } from "formik";
import { X } from "lucide-react";

import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";

import { attendanceSchema } from "../attendance.utils";
import { useEnrollmentOptions } from "../hooks/useEnrollmentOptions";
import { useTeacherSubjectSectionOptions } from "../hooks/useTeacherSubjectSectionOptions";
import { useAcademicPeriodOptions } from "../hooks/useAcademicPeriodOptions";
import { useAttendanceStatusOptions } from "../hooks/useAttendanceStatusOptions";
import { useAbsenceTypeOptions } from "../hooks/useAbsenceTypeOptions";

import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { AttendanceFormValues, AttendanceT } from "../attendance.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    enrollment: "Matrícula",
    teacher_subject_section: "Clase",
    academic_period: "Período Académico",
    attendance_status: "Estado",
    absence_type: "Tipo de Ausencia",
    attendance_date: "Fecha",
    observation: "Observaciones",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingAttendance: AttendanceT | null;
  onSubmit: (values: AttendanceFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingAttendance,
  onSubmit,
  submitErrors,
}) => {
  const { enrollmentOptions, loading: loadingEnrollments } = useEnrollmentOptions();
  const { teacherSubjectSectionOptions, loading: loadingTSS } = useTeacherSubjectSectionOptions();
  const { academicPeriodOptions, loading: loadingPeriods } = useAcademicPeriodOptions();
  const { attendanceStatusOptions, loading: loadingStatuses } = useAttendanceStatusOptions();
  const { absenceTypeOptions, loading: loadingAbsenceTypes } = useAbsenceTypeOptions();

  const getInitialValues = (): AttendanceFormValues => {
    if (editingAttendance) {
      return {
        enrollment: editingAttendance.enrollment,
        teacher_subject_section: editingAttendance.teacher_subject_section,
        academic_period: editingAttendance.academic_period,
        attendance_status: editingAttendance.attendance_status,
        absence_type: editingAttendance.absence_type,
        attendance_date: editingAttendance.attendance_date,
        observation: editingAttendance.observation,
      };
    }
    return { enrollment: null, teacher_subject_section: null, academic_period: null, attendance_status: null, absence_type: null, attendance_date: "", observation: "" };
  };

  const formik = useFormik<AttendanceFormValues>({
    initialValues: getInitialValues(),
    validationSchema: attendanceSchema,
    onSubmit,
  });

  const isLoading = loadingEnrollments || loadingTSS || loadingPeriods || loadingStatuses || loadingAbsenceTypes;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{isEdit ? "Editar Asistencia" : "Nueva Asistencia"}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{isEdit ? "Actualice el registro de asistencia" : "Registre una nueva asistencia"}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        {(submitErrors.general.length > 0 || Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomSelect label="Matrícula" name="enrollment" onChange={(option) => formik.setFieldValue("enrollment", option.value ? Number(option.value) : null)} options={enrollmentOptions} className={selectClassname} disabled={isLoading} value={formik.values.enrollment ?? ""} error={formik.touched.enrollment ? (formik.errors.enrollment as string) : undefined} />
          <CustomSelect label="Clase" name="teacher_subject_section" onChange={(option) => formik.setFieldValue("teacher_subject_section", option.value ? Number(option.value) : null)} options={teacherSubjectSectionOptions} className={selectClassname} disabled={isLoading} value={formik.values.teacher_subject_section ?? ""} error={formik.touched.teacher_subject_section ? (formik.errors.teacher_subject_section as string) : undefined} />
          <CustomSelect label="Período Académico" name="academic_period" onChange={(option) => formik.setFieldValue("academic_period", option.value ? Number(option.value) : null)} options={academicPeriodOptions} className={selectClassname} disabled={isLoading} value={formik.values.academic_period ?? ""} error={formik.touched.academic_period ? (formik.errors.academic_period as string) : undefined} />
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect label="Estado" name="attendance_status" onChange={(option) => formik.setFieldValue("attendance_status", option.value ? Number(option.value) : null)} options={attendanceStatusOptions} className={selectClassname} disabled={isLoading} value={formik.values.attendance_status ?? ""} error={formik.touched.attendance_status ? (formik.errors.attendance_status as string) : undefined} />
            <CustomSelect label="Tipo de Ausencia" name="absence_type" onChange={(option) => formik.setFieldValue("absence_type", option.value ? Number(option.value) : null)} options={[{ label: "Sin tipo", value: "" }, ...absenceTypeOptions]} className={selectClassname} disabled={isLoading} value={formik.values.absence_type ?? ""} error={formik.touched.absence_type ? (formik.errors.absence_type as string) : undefined} />
          </div>
          <CustomInput label="Fecha" name="attendance_date" type="date" value={formik.values.attendance_date} onBlur={formik.handleBlur} onChange={formik.handleChange} error={formik.touched.attendance_date ? formik.errors.attendance_date : undefined} className={inputClassname} />
          <CustomInput label="Observaciones" name="observation" placeholder="Observaciones opcionales" value={formik.values.observation} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" error={formik.touched.observation ? formik.errors.observation : undefined} className={inputClassname} />
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={formik.isSubmitting || isLoading} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
              {formik.isSubmitting ? (<><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Guardando...</>) : isEdit ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
