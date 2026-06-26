import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { useCallback, useState } from "react";
import type {
  RoleFormValues,
  RoleT,
} from "../roles.types";
import type { RoleControllerT } from "./useRoleController";

interface UseFormArgs {
  create: RoleControllerT["createRole"];
  update: RoleControllerT["updateRole"];
}

export const useRoleForm = ({
  create,
  update,
}: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoleT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editingItem;

  const openModal = useCallback((entity?: RoleT) => {
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
    async (values: RoleFormValues) => {
      setSubmitErrors({ general: [], validation: {} });

      if (editingItem) {
        const { name, description } = values;
        const result = await unwrapMutation(
          { id: editingItem.id, data: { name, description } },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const { name, description } = values;
        const result = await unwrapMutation({ name, description }, create);
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
