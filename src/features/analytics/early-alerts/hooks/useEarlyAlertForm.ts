import { useCallback, useState } from "react";

import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import type { EarlyAlertControllerT } from "./useEarlyAlertController";
import type {
  EarlyAlertFormValues,
  EarlyAlertT,
  EarlyAlertUpdateDataT,
} from "../early-alerts.types";

interface UseEarlyAlertFormArgs {
  create: EarlyAlertControllerT["create"];
  update: EarlyAlertControllerT["update"];
}

export const useEarlyAlertForm = ({ create, update }: UseEarlyAlertFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<EarlyAlertT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });
  const isEdit = !!editing;

  const openModal = useCallback((entity?: EarlyAlertT) => {
    setEditing(entity ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(async (values: EarlyAlertFormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (editing) {
      const data: EarlyAlertUpdateDataT = {
        ...values,
        alert_type: values.alert_type || null,
        urgency_level: values.urgency_level || null,
      };
      const result = await unwrapMutation({ id: editing.id, data }, update);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    } else {
      const { enrollment, academic_period, alert_type, description, urgency_level, response_actions } = values;
      const result = await unwrapMutation({
        enrollment, academic_period,
        alert_type: alert_type || null,
        description,
        urgency_level: urgency_level || null,
        response_actions,
      }, create);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    }
  }, [editing, create, update, closeModal]);

  return { isOpen, isEdit, editing, submitErrors, openModal, closeModal, handleSubmit };
};
