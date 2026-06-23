import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  useClassScheduleController,
  useClassScheduleForm,
} from "./class-schedule.controller";
import { useTeacherSubjectSectionOptions } from "./class-schedule.options";
import { ClassScheduleDeleteModal } from "./components/ClassScheduleDeleteModal";
import { ClassScheduleFormModal } from "./components/ClassScheduleFormModal";
import { ClassScheduleTable } from "./components/ClassScheduleTable";
import { ClassScheduleViewModal } from "./components/ClassScheduleViewModal";
import type { ClassScheduleT } from "./class-schedule.types";

export default function ClassSchedulesPage() {
  const { teacherSubjectSectionOptions } = useTeacherSubjectSectionOptions();

  const {
    classSchedules,
    isLoading,
    loadClassSchedules,
    createClassSchedule,
    updateClassSchedule,
    deleteClassSchedule,
  } = useClassScheduleController();

  const {
    isOpen,
    isEdit,
    editingClassSchedule,
    submitErrors,
    openModal,
    closeModal,
    handleCreate,
    handleUpdate,
  } = useClassScheduleForm({
    create: createClassSchedule,
    update: updateClassSchedule,
  });

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [deletingSchedule, setDeletingSchedule] =
    useState<ClassScheduleT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewModal = useCallback((schedule: ClassScheduleT) => {
    setViewingId(schedule.id);
    setIsViewOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewOpen(false);
    setViewingId(null);
  }, []);

  const openDeleteModal = useCallback((schedule: ClassScheduleT) => {
    setDeletingSchedule(schedule);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false);
    setDeletingSchedule(null);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      await deleteClassSchedule(id);
    },
    [deleteClassSchedule],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Horarios Académicos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los horarios de clases
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Horario
        </button>
      </div>

      <ClassScheduleTable
        classSchedules={classSchedules}
        isLoading={isLoading}
        loadClassSchedules={loadClassSchedules}
        onEdit={openModal}
        onView={openViewModal}
        onDelete={openDeleteModal}
      />

      <ClassScheduleFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingClassSchedule={editingClassSchedule}
        teacherSubjectSectionOptions={teacherSubjectSectionOptions}
        submitErrors={submitErrors}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <ClassScheduleViewModal
        isOpen={isViewOpen}
        scheduleId={viewingId}
        onClose={closeViewModal}
      />

      <ClassScheduleDeleteModal
        isOpen={isDeleteOpen}
        schedule={deletingSchedule}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
