import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { ConductIncidentT, ConductIncidentFormValues } from "../conduct-incident.types";
import type { useConductIncidentController } from "./useConductIncidentController";

export type CIControllerT = ReturnType<typeof useConductIncidentController>;

export interface UseFormArgs {
  create: CIControllerT["createItem"];
  update: CIControllerT["updateItem"];
}

export const useConductIncidentForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<ConductIncidentT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((item?: ConductIncidentT) => {
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
    async (values: ConductIncidentFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const payload = {
        incident_type: values.incident_type!,
        severity: values.severity!,
        academic_period: values.academic_period!,
        enrollment: values.enrollment!,
        incident_date: values.incident_date,
        description: values.description,
        actions_taken: values.actions_taken,
        family_notified: values.family_notified,
      };
      if (editing) {
        const response = await unwrapMutation(
          { id: editing.id, data: payload },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const response = await unwrapMutation(payload, create);
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
