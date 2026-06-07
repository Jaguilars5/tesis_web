import { Plus } from "lucide-react";

import { QualitativeScalesFormModal } from "../components/form/QualitativeScalesFormModal";
import { QualitativeScalesTable } from "../components/form/QualitativeScalesTable";
import { useQualitativeScalesForm } from "../presentation/hooks/useQualitativeScalesForm";

export default function QualitativeScalesPage() {
  const {
    isOpen,
    isEdit,
    editingQualitativeScale,
    openModal,
    closeModal,
    handleSubmit,
  } = useQualitativeScalesForm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Escalas Cualitativas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las escalas de calificación cualitativa
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nueva Escala Cualitativa
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <QualitativeScalesTable onEdit={openModal} />
      </div>

      <QualitativeScalesFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingQualitativeScale={editingQualitativeScale}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
