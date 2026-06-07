import { Download, Plus, Search } from "lucide-react";

import { SubjectOfferingFormModal } from "../components/form/SubjectOfferingFormModal";
import { SubjectOfferingTable } from "../components/form/SubjectOfferingTable";
import { useSubjectOfferingForm } from "../presentation/hooks/useSubjectOfferingForm";

export default function SubjectOfferingsPage() {
  const {
    isOpen,
    isEdit,
    editingSubjectOffering,
    openModal,
    closeModal,
    handleSubmit,
  } = useSubjectOfferingForm();

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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <div className="relative min-w-50 flex-1">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar ofertas..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 pl-8 text-sm"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Download className="size-3.5" />
            Exportar
          </button>
        </div>

        <SubjectOfferingTable onEdit={openModal} />
      </div>

      <SubjectOfferingFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingSubjectOffering={editingSubjectOffering}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
