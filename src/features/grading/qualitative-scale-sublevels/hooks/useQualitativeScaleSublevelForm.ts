import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { useCallback, useState } from "react";
import type {
  QualitativeScaleSublevelFormValues,
  QualitativeScaleSublevelT,
} from "../qualitative-scale-sublevels.types";
import type { QualitativeScaleSublevelsControllerT } from "./useQualitativeScaleSublevelsController";

interface UseFormArgs {
  create: QualitativeScaleSublevelsControllerT["createQualitativeScaleSublevel"];
  update: QualitativeScaleSublevelsControllerT["updateQualitativeScaleSublevel"];
}

export const useQualitativeScaleSublevelsForm = ({
  create,
  update,
}: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QualitativeScaleSublevelT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editingItem;

  const openModal = useCallback((entity?: QualitativeScaleSublevelT) => {
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
    async (values: QualitativeScaleSublevelFormValues) => {
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
        const { scale, sublevel } = values;
        const result = await unwrapMutation({ scale, sublevel }, create);
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
