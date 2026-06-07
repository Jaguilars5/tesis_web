import { Plus } from "lucide-react";

import { PromotionStatusesFormModal } from "../components/form/PromotionStatusesFormModal";
import { PromotionStatusesTable } from "../components/form/PromotionStatusesTable";
import { usePromotionStatusesForm } from "../presentation/hooks/usePromotionStatusesForm";

export default function PromotionStatusesPage() {
  const {
    isOpen,
    isEdit,
    editingPromotionStatus,
    openModal,
    closeModal,
    handleSubmit,
  } = usePromotionStatusesForm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Estados de Promoción</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los estados de promoción académica
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Estado de Promoción
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <PromotionStatusesTable onEdit={openModal} />
      </div>

      <PromotionStatusesFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingPromotionStatus={editingPromotionStatus}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
