import { useCallback, useState } from "react";
import { createPeriodGradeSummary, updatePeriodGradeSummary } from "../../reducers/period-grade-summaries.thunks";
import { usePeriodGradeSummariesController } from "./usePeriodGradeSummariesController";
import type { PeriodGradeSummaryT } from "../../domain/entities/period-grade-summaries.types";

export interface PeriodGradeSummaryFormValues {
  formative_avg: number;
  summative_avg: number;
  final_avg_truncated: number;
  requires_recovery: boolean;
  enrollment: number;
  subject_offering: number;
  academic_period: number;
  qualitative_scale?: number | null;
  promotion_status?: number | null;
}

export const usePeriodGradeSummariesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPeriodGradeSummary, setEditingPeriodGradeSummary] = useState<PeriodGradeSummaryT | null>(null);
  const isEdit = !!editingPeriodGradeSummary;

  const { createPeriodGradeSummary: create, updatePeriodGradeSummary: update } = usePeriodGradeSummariesController();

  const openModal = useCallback((periodGradeSummary?: PeriodGradeSummaryT) => {
    setEditingPeriodGradeSummary(periodGradeSummary ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingPeriodGradeSummary(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: PeriodGradeSummaryFormValues) => {
      let result;
      if (editingPeriodGradeSummary) {
        result = await update({
          formative_avg: values.formative_avg,
          summative_avg: values.summative_avg,
          final_avg_truncated: values.final_avg_truncated,
          requires_recovery: values.requires_recovery,
          enrollment: values.enrollment,
          subject_offering: values.subject_offering,
          academic_period: values.academic_period,
          qualitative_scale: values.qualitative_scale,
          promotion_status: values.promotion_status,
          id: editingPeriodGradeSummary.id,
        });
      } else {
        result = await create({
          formative_avg: values.formative_avg,
          summative_avg: values.summative_avg,
          final_avg_truncated: values.final_avg_truncated,
          requires_recovery: values.requires_recovery,
          enrollment: values.enrollment,
          subject_offering: values.subject_offering,
          academic_period: values.academic_period,
          qualitative_scale: values.qualitative_scale,
          promotion_status: values.promotion_status,
        });
      }
      if (
        createPeriodGradeSummary.fulfilled.match(result) ||
        updatePeriodGradeSummary.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingPeriodGradeSummary, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingPeriodGradeSummary,
    openModal,
    closeModal,
    handleSubmit,
  };
};
