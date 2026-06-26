import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { useCallback, useState } from "react";
import type {
  UserCreateFormValues,
  UserEditFormValues,
  UserT,
} from "../users.types";
import type { UserControllerT } from "./useUserController";

interface UseFormArgs {
  create: UserControllerT["createUser"];
  update: UserControllerT["updateUser"];
}

export const useUserForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });

  const isEdit = !!editingItem;

  const openModal = useCallback((entity?: UserT) => {
    setEditingItem(entity ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingItem(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleCreate = useCallback(
    async (values: UserCreateFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      const result = await unwrapMutation(
        {
          document_number: values.document_number,
          names: values.names,
          last_names: values.last_names,
          email: values.email,
          password: values.password,
          role_id: values.role_id,
        },
        create,
      );
      if (result.ok) {
        closeModal();
        return;
      }
      setSubmitErrors(result.errors);
    },
    [create, closeModal],
  );

  const handleUpdate = useCallback(
    async (values: UserEditFormValues) => {
      if (!editingItem) return;
      setSubmitErrors({ general: [], validation: {} });
      const result = await unwrapMutation(
        { id: editingItem.id, data: { email: values.email, role_id: values.role_id } },
        update,
      );
      if (result.ok) {
        closeModal();
        return;
      }
      setSubmitErrors(result.errors);
    },
    [editingItem, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingItem,
    submitErrors,
    openModal,
    closeModal,
    handleCreate,
    handleUpdate,
  };
};
