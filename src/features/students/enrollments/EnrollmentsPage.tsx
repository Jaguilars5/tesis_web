import { GraduationCap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEnrollmentsController } from "./enrollments.controller";
import { EnrollmentsTable } from "./components/EnrollmentsTable";
import { EnrollmentFormModal } from "./components/EnrollmentFormModal";
import { EnrollmentDeleteModal } from "./components/EnrollmentDeleteModal";
import { EnrollmentViewModal } from "./components/EnrollmentViewModal";
import { sectionService } from "@features/institutions/section";
import type { EnrollmentT } from "./enrollments.types";

export default function EnrollmentsPage() {
  const navigate = useNavigate();
  const { enrollments, isLoading, loadEnrollments, updateEnrollment, deleteEnrollment } = useEnrollmentsController();
  const [sectionOptions, setSectionOptions] = useState<{ label: string; value: string }[]>([]);
  const [isEditing, setIsEditing] = useState<EnrollmentT | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<EnrollmentT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<{ general: string[]; validation: Record<string, string> }>({ general: [], validation: {} });

  useEffect(() => { sectionService.list({ page: 1, pageSize: 100 }).then((items) => setSectionOptions(items.map((s) => ({ label: s.parallel, value: String(s.id) })))).catch(() => {}); }, []);

  const openEditModal = useCallback((enrollment: EnrollmentT) => { setIsEditing(enrollment); setSubmitErrors({ general: [], validation: {} }); setIsFormOpen(true); }, []);
  const closeFormModal = useCallback(() => { setIsFormOpen(false); setIsEditing(null); setSubmitErrors({ general: [], validation: {} }); }, []);

  const openViewModal = useCallback((enrollment: EnrollmentT) => { setViewingId(enrollment.id); setIsViewOpen(true); }, []);
  const closeViewModal = useCallback(() => { setIsViewOpen(false); setViewingId(null); }, []);

  const openDeleteModal = useCallback((enrollment: EnrollmentT) => { setDeleting(enrollment); setIsDeleteOpen(true); }, []);
  const closeDeleteModal = useCallback(() => { setIsDeleteOpen(false); setDeleting(null); }, []);

  const handleDeleteConfirm = useCallback(async (id: number) => { await deleteEnrollment(id); }, [deleteEnrollment]);

  const handleEditSubmit = useCallback(async (values: { section: number; enrollment_status: string; is_repeat: boolean; student_condition: string; cellphone: string; email: string; observations: string; is_active: boolean }) => {
    if (!isEditing) return;
    setSubmitErrors({ general: [], validation: {} });
    try {
      await updateEnrollment({ id: isEditing.id, data: values });
      closeFormModal();
    } catch (err) {
      const e = err as { msg?: string; data?: Record<string, string> | null };
      setSubmitErrors({ general: e.msg ? [e.msg] : ["Error al actualizar"], validation: e.data ?? {} });
    }
  }, [isEditing, updateEnrollment, closeFormModal]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Matrículas</h1>
          <p className="mt-1 text-sm text-slate-500">Gestiona las matrículas de los estudiantes</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/enrollments/new")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover"><GraduationCap className="size-4" />Nueva Matrícula</button>
        </div>
      </div>
      <EnrollmentsTable enrollments={enrollments} isLoading={isLoading} loadEnrollments={loadEnrollments} onEdit={openEditModal} onView={openViewModal} onDelete={openDeleteModal} />
      <EnrollmentFormModal isOpen={isFormOpen} onClose={closeFormModal} isEdit={true} editingEnrollment={isEditing} onSubmit={handleEditSubmit} submitErrors={submitErrors} sectionOptions={sectionOptions} />
      <EnrollmentViewModal isOpen={isViewOpen} enrollmentId={viewingId} onClose={closeViewModal} />
      <EnrollmentDeleteModal isOpen={isDeleteOpen} enrollment={deleting} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} />
    </div>
  );
}
