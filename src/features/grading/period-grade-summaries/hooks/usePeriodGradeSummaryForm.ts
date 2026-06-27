import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { useCallback, useState } from "react";
import type {
  PeriodGradeSummaryFormValues,
  PeriodGradeSummaryT,
} from "../period-grade-summaries.types";
import type { PeriodGradeSummariesControllerT } from "./usePeriodGradeSummariesController";

interface UseFormArgs {
  create: PeriodGradeSummariesControllerT["createPeriodGradeSummary"];
  update: PeriodGradeSummariesControllerT["updatePeriodGradeSummary"];
}

export const usePeriodGradeSummariesForm = ({
  create,
  update,
}: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PeriodGradeSummaryT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editingItem;

  const openModal = useCallback((entity?: PeriodGradeSummaryT) => {
    setEditingItem(entity ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingItem(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: PeriodGradeSummaryFormValues) => {
      setSubmitErrors({ general: [], validation: {} });

      if (editingItem) {
        const result = await unwrapMutation(
          { id: editingItem.id, data: values },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const {
          formative_avg,
          summative_avg,
          final_avg_truncated,
          is_failing,
          enrollment,
          subject_offering,
          academic_period,
          qualitative_scale,
          promotion_status,
        } = values;
        const result = await unwrapMutation(
          {
            formative_avg,
            summative_avg,
            final_avg_truncated,
            is_failing,
            enrollment,
            subject_offering,
            academic_period,
            qualitative_scale,
            promotion_status,
          },
          create,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editingItem, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
