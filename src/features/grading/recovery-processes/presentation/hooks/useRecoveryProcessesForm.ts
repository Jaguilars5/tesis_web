import { useCallback, useState } from "react";
import { createRecoveryProcess, updateRecoveryProcess } from "../../reducers/recovery-processes.thunks";
import { useRecoveryProcessesController } from "./useRecoveryProcessesController";
import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";

export interface RecoveryProcessFormValues {
  initial_grade: number;
  reinforcement_grade?: number | null;
  improvement_eval_grade?: number | null;
  final_calculated_grade?: number | null;
  family_notified: boolean;
  start_date: string;
  end_date?: string | null;
  observations?: string | null;
  period_grade_summary: number;
  managed_by_user: number;
  process_type?: number | null;
}

export const useRecoveryProcessesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingRecoveryProcess, setEditingRecoveryProcess] = useState<RecoveryProcessT | null>(null);
  const isEdit = !!editingRecoveryProcess;

  const { createRecoveryProcess: create, updateRecoveryProcess: update } = useRecoveryProcessesController();

  const openModal = useCallback((recoveryProcess?: RecoveryProcessT) => {
    setEditingRecoveryProcess(recoveryProcess ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingRecoveryProcess(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: RecoveryProcessFormValues) => {
      let result;
      if (editingRecoveryProcess) {
        result = await update({
          ...values,
          id: editingRecoveryProcess.id,
        });
      } else {
        result = await create(values);
      }
      if (
        createRecoveryProcess.fulfilled.match(result) ||
        updateRecoveryProcess.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingRecoveryProcess, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingRecoveryProcess,
    openModal,
    closeModal,
    handleSubmit,
  };
};
