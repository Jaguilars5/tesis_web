import { Plus } from "lucide-react";

import { RecoveryProcessesFormModal } from "../components/form/RecoveryProcessesFormModal";
import { RecoveryProcessesTable } from "../components/form/RecoveryProcessesTable";
import { useRecoveryProcessesController } from "../presentation/hooks/useRecoveryProcessesController";
import { useRecoveryProcessesForm } from "../presentation/hooks/useRecoveryProcessesForm";

import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";

export default function RecoveryProcessesPage() {
  const { deleteRecoveryProcess } = useRecoveryProcessesController();

  const {
    isOpen,
    isEdit,
    editingRecoveryProcess,
    openModal,
    closeModal,
    handleSubmit,
  } = useRecoveryProcessesForm();

  const periodGradeSummaryOptions: SelectOptionT[] = [
    { value: 1, label: "Resumen 1" },
  ];

  const managedByUserOptions: SelectOptionT[] = [
    { value: 1, label: "Usuario 1" },
  ];

  const processTypeOptions: SelectOptionT[] = [
    { value: 1, label: "Tipo 1" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Procesos de Recuperación</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los procesos de recuperación académica
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Proceso de Recuperación
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <RecoveryProcessesTable
          onEdit={openModal}
          onDelete={(id) => deleteRecoveryProcess(id)}
        />
      </div>

      <RecoveryProcessesFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingRecoveryProcess={editingRecoveryProcess}
        onSubmit={handleSubmit}
        periodGradeSummaryOptions={periodGradeSummaryOptions}
        managedByUserOptions={managedByUserOptions}
        processTypeOptions={processTypeOptions}
      />
    </div>
  );
}
