import { Plus } from "lucide-react";

import { ComponentIndicatorsFormModal } from "../components/form/ComponentIndicatorsFormModal";
import { ComponentIndicatorsTable } from "../components/form/ComponentIndicatorsTable";
import { useComponentIndicatorsForm } from "../presentation/hooks/useComponentIndicatorsForm";

const blockComponentOptions = [
  { label: "Componente 1", value: "1" },
  { label: "Componente 2", value: "2" },
];

export default function ComponentIndicatorsPage() {
  const {
    isOpen,
    isEdit,
    editingComponentIndicator,
    openModal,
    closeModal,
    handleSubmit,
  } = useComponentIndicatorsForm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Indicadores de Componente</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los indicadores de componente académico
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Indicador de Componente
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ComponentIndicatorsTable onEdit={openModal} />
      </div>

      <ComponentIndicatorsFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingComponentIndicator={editingComponentIndicator}
        onSubmit={handleSubmit}
        blockComponentOptions={blockComponentOptions}
      />
    </div>
  );
}
