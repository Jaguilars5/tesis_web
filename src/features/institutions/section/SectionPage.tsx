import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { useSectionController } from "./hooks/useSectionController";
import { useSectionForm } from "./hooks/useSectionForm";
import { useSchoolYearOptions } from "./hooks/useSchoolYearOptions";
import { useAcademicGradeOptions } from "./hooks/useAcademicGradeOptions";
import { SectionDeleteModal } from "./components/SectionDeleteModal";
import { SectionFormModal } from "./components/SectionFormModal";
import { SectionTable } from "./components/SectionTable";
import { SectionViewModal } from "./components/SectionViewModal";
import { SECTION_PERMISSIONS } from "./section.constants";
import type { SectionT } from "./section.types";

export default function SectionsPage() {
  const {
    sections,
    isLoading,
    loadSections,
    createSection,
    updateSection,
    deleteSection,
  } = useSectionController();
  const {
    isOpen,
    isEdit,
    editingSection,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  } = useSectionForm({ create: createSection, update: updateSection });
  const { schoolYearOptions } = useSchoolYearOptions();
  const { academicGradeOptions } = useAcademicGradeOptions();
  const permissions = useAppSelector(selectUserPermissions);
  const canCreate = hasPermission(permissions, SECTION_PERMISSIONS.CREATE);
  const canEdit = hasPermission(permissions, SECTION_PERMISSIONS.UPDATE);
  const canDelete = hasPermission(permissions, SECTION_PERMISSIONS.DELETE);
  const [viewing, setViewing] = useState<SectionT | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<SectionT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((section: SectionT) => {
    setViewing(section);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewing(null);
    setIsViewOpen(false);
  }, []);

  const openDeleteModal = useCallback((section: SectionT) => {
    setDeleting(section);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleting(null);
    setIsDeleteOpen(false);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Secciones</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las secciones/paralelos
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Nueva Sección
          </button>
        )}
      </div>
      <SectionTable
        sections={sections}
        isLoading={isLoading}
        loadSections={loadSections}
        schoolYearOptions={schoolYearOptions}
        academicGradeOptions={academicGradeOptions}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
        canEdit={canEdit}
        canDelete={canDelete}
      />
      <SectionFormModal
        key={editingSection?.id ?? "create"}
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingSection={editingSection}
        onSubmit={handleSubmit}
        submitErrors={submitErrors}
        schoolYearOptions={schoolYearOptions}
        academicGradeOptions={academicGradeOptions}
      />
      <SectionViewModal
        isOpen={isViewOpen}
        sectionId={viewing?.id ?? null}
        onClose={closeViewModal}
      />
      <SectionDeleteModal
        isOpen={isDeleteOpen}
        section={deleting}
        onClose={closeDeleteModal}
        onSoftDelete={deleteSection}
      />
    </div>
  );
}
