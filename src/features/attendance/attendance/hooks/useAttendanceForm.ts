import { useCallback, useState } from "react";
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { AttendanceT, AttendanceFormValues } from "../attendance.types";
import type { useAttendanceController } from "./useAttendanceController";

export type AControllerT = ReturnType<typeof useAttendanceController>;

export interface UseFormArgs {
  create: AControllerT["createItem"];
  update: AControllerT["updateItem"];
}

export const useAttendanceForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editing;

  const openModal = useCallback((item?: AttendanceT) => {
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
    async (values: AttendanceFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const payload = {
        enrollment: values.enrollment!,
        teacher_subject_section: values.teacher_subject_section!,
        academic_period: values.academic_period!,
        attendance_status: values.attendance_status!,
        absence_type: values.absence_type ?? null,
        attendance_date: values.attendance_date,
        observation: values.observation,
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
