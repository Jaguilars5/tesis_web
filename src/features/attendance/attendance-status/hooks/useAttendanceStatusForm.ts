import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { AttendanceStatusT, AttendanceStatusFormValues } from "../attendance-status.types";
import type { useAttendanceStatusController } from "./useAttendanceStatusController";

export type ASControllerT = ReturnType<typeof useAttendanceStatusController>;

export interface UseFormArgs {
  create: ASControllerT["createItem"];
  update: ASControllerT["updateItem"];
}

export const useAttendanceStatusForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceStatusT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((item?: AttendanceStatusT) => {
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
    async (values: AttendanceStatusFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const { code, name, description } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { code, name, description } },
          update,
        );
        if (response.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(response.errors);
      } else {
        const { code, name, description } = values;
        const response = await unwrapMutation(
          { code, name, description },
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
