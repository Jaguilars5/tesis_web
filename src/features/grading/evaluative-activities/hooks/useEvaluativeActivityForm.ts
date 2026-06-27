import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type {
  EvaluativeActivityT,
  EvaluativeActivityFormValues,
} from "../evaluative-activities.types";
import type { EAControllerT } from "./useEvaluativeActivityController";

export interface UseFormArgs {
  create: EAControllerT["createItem"];
  update: EAControllerT["updateItem"];
}

export const useEvaluativeActivityForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<EvaluativeActivityT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((item?: EvaluativeActivityT) => {
    setEditing(item ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: EvaluativeActivityFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const {
          title,
          teacher_subject_section,
          activity_type,
          max_score,
          due_date,
        } = values;
        const response = await unwrapMutation(
          {
            id: editing.id,
            data: {
              title,
              teacher_subject_section,
              activity_type,
              max_score,
              due_date,
            },
          },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const {
          title,
          teacher_subject_section,
          activity_type,
          max_score,
          due_date,
          block_component,
          internal_weight,
        } = values;
        const response = await unwrapMutation(
          {
            title,
            teacher_subject_section,
            activity_type,
            max_score,
            due_date,
            block_component,
            internal_weight,
          },
          create,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      }
    },
    [editing, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingItem: editing,
    submitErrors,
    openModal,
    closeModal,
    handleSubmit,
  };
};
