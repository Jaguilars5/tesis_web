import { Plus } from "lucide-react";

import { StudentNotesFormModal } from "../components/form/StudentNotesFormModal";
import { StudentNotesTable } from "../components/form/StudentNotesTable";
import { useStudentNotesForm } from "../presentation/hooks/useStudentNotesForm";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";

const EMPTY_OPTIONS: SelectOptionT[] = [];

export default function StudentNotesPage() {
  const {
    isOpen,
    isEdit,
    editingStudentNote,
    openModal,
    closeModal,
    handleSubmit,
  } = useStudentNotesForm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Notas de Estudiantes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las notas académicas de los estudiantes
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nueva Nota de Estudiante
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <StudentNotesTable onEdit={openModal} />
      </div>

      <StudentNotesFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingStudentNote={editingStudentNote}
        onSubmit={handleSubmit}
        enrollmentOptions={EMPTY_OPTIONS}
        evaluativeActivityOptions={EMPTY_OPTIONS}
        gradeTypeOptions={EMPTY_OPTIONS}
        qualitativeScaleOptions={EMPTY_OPTIONS}
      />
    </div>
  );
}
