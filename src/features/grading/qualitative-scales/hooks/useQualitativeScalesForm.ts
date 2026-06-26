import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { useCallback, useState } from "react";
import type {
  QualitativeScaleFormValues,
  QualitativeScaleT,
} from "../qualitative-scales.types";
import type { QualitativeScalesControllerT } from "./useQualitativeScalesController";

interface UseFormArgs {
  create: QualitativeScalesControllerT["createQualitativeScale"];
  update: QualitativeScalesControllerT["updateQualitativeScale"];
}

export const useQualitativeScalesForm = ({
  create,
  update,
}: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QualitativeScaleT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editingItem;

  const openModal = useCallback((entity?: QualitativeScaleT) => {
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
    async (values: QualitativeScaleFormValues) => {
      setSubmitErrors({ general: [], validation: {} });

      if (editingItem) {
        const { code, name, description, numeric_equivalence } = values;
        const result = await unwrapMutation(
          { id: editingItem.id, data: { code, name, description, numeric_equivalence } },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const { code, name, description, numeric_equivalence } = values;
        const result = await unwrapMutation(
          { code, name, description, numeric_equivalence },
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
