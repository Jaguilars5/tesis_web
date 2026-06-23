import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useSubjectOfferingController,
  useSubjectOfferingForm,
} from "./subject-offering.controller";
import {
  useSchoolYearOptions,
  useSectionOptions,
  useSubjectAcademicConfigOptions,
} from "./subject-offering.options";
import { SubjectOfferingDeleteModal } from "./components/SubjectOfferingDeleteModal";
import { SubjectOfferingFormModal } from "./components/SubjectOfferingFormModal";
import { SubjectOfferingTable } from "./components/SubjectOfferingTable";
import { SubjectOfferingViewModal } from "./components/SubjectOfferingViewModal";

import type { SubjectOfferingT } from "./subject-offering.types";

export default function SubjectOfferingsPage() {
  const { schoolYearOptions } = useSchoolYearOptions();
  const { sectionOptions } = useSectionOptions();
  const { subjectAcademicConfigOptions } = useSubjectAcademicConfigOptions();

  const {
    subjectOfferings,
    isLoading,
    loadSubjectOfferings,
    createSubjectOffering,
    updateSubjectOffering,
    deleteSubjectOffering,
  } = useSubjectOfferingController();

  const {
    isOpen,
    isEdit,
    editingSubjectOffering,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useSubjectOfferingForm({
    create: createSubjectOffering,
    update: updateSubjectOffering,
  });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingOffering, setDeletingOffering] =
    useState<SubjectOfferingT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((offering: SubjectOfferingT) => {
    setViewingId(offering.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((offering: SubjectOfferingT) => {
    setDeletingOffering(offering);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingOffering(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      await deleteSubjectOffering(id);
    },
    [deleteSubjectOffering],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Ofertas de Materia
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las ofertas curriculares de materias en aulas
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nueva Oferta
        </button>
      </div>

      <SubjectOfferingTable
        subjectOfferings={subjectOfferings}
        isLoading={isLoading}
        loadSubjectOfferings={loadSubjectOfferings}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
      />

      <SubjectOfferingFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingSubjectOffering={editingSubjectOffering}
        schoolYearOptions={schoolYearOptions}
        sectionOptions={sectionOptions}
        subjectAcademicConfigOptions={subjectAcademicConfigOptions}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
      />

      <SubjectOfferingViewModal
        isOpen={isViewOpen}
        offeringId={viewingId}
        onClose={closeViewModal}
      />

      <SubjectOfferingDeleteModal
        isOpen={isDeleteOpen}
        offering={deletingOffering}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
