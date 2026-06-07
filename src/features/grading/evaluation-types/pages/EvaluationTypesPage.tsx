import { Plus } from "lucide-react";

import { EvaluationTypesFormModal } from "../components/form/EvaluationTypesFormModal";
import { EvaluationTypesTable } from "../components/form/EvaluationTypesTable";
import { useEvaluationTypesForm } from "../presentation/hooks/useEvaluationTypesForm";

export default function EvaluationTypesPage() {
  const {
    isOpen,
    isEdit,
    editingEvaluationType,
    openModal,
    closeModal,
    handleSubmit,
  } = useEvaluationTypesForm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Tipos de Evaluación</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los tipos de evaluación académica
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Tipo de Evaluación
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <EvaluationTypesTable onEdit={openModal} />
      </div>

      <EvaluationTypesFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingEvaluationType={editingEvaluationType}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
