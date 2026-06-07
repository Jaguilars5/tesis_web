import { Plus } from "lucide-react";

import { PeriodGradeSummariesFormModal } from "../components/form/PeriodGradeSummariesFormModal";
import { PeriodGradeSummariesTable } from "../components/form/PeriodGradeSummariesTable";
import { usePeriodGradeSummariesForm } from "../presentation/hooks/usePeriodGradeSummariesForm";

import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";

interface PeriodGradeSummariesPageProps {
  enrollmentOptions?: SelectOptionT[];
  subjectOfferingOptions?: SelectOptionT[];
  academicPeriodOptions?: SelectOptionT[];
  qualitativeScaleOptions?: SelectOptionT[];
  promotionStatusOptions?: SelectOptionT[];
}

export default function PeriodGradeSummariesPage({
  enrollmentOptions = [],
  subjectOfferingOptions = [],
  academicPeriodOptions = [],
  qualitativeScaleOptions = [],
  promotionStatusOptions = [],
}: PeriodGradeSummariesPageProps) {
  const {
    isOpen,
    isEdit,
    editingPeriodGradeSummary,
    openModal,
    closeModal,
    handleSubmit,
  } = usePeriodGradeSummariesForm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Resúmenes de Calificaciones</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los resúmenes de calificaciones por período
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          Nuevo Resumen de Calificaciones
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <PeriodGradeSummariesTable onEdit={openModal} />
      </div>

      <PeriodGradeSummariesFormModal
        isOpen={isOpen}
        onClose={closeModal}
        isEdit={isEdit}
        editingPeriodGradeSummary={editingPeriodGradeSummary}
        onSubmit={handleSubmit}
        enrollmentOptions={enrollmentOptions}
        subjectOfferingOptions={subjectOfferingOptions}
        academicPeriodOptions={academicPeriodOptions}
        qualitativeScaleOptions={qualitativeScaleOptions}
        promotionStatusOptions={promotionStatusOptions}
      />
    </div>
  );
}
