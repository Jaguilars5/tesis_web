import { useAppDispatch } from "@shared/redux/hooks";
import { Plus } from "lucide-react";
import { useState } from "react";

import { RepresentativeFormModal } from "../components/RepresentativeFormModal";
import { RepresentativeTable } from "../components/RepresentativeTable";
import type { RepresentativeFormValues } from "../helpers/representative.helpers";
import {
  createRepresentative,
  updateRepresentative,
} from "../redux/representative.thunks";
import type { Representative } from "../types/representative.types";

export default function RepresentativePage() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRepresentative, setEditingRepresentative] =
    useState<Representative | null>(null);

  const handleOpenModal = () => {
    setEditingRepresentative(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRepresentative(null);
  };

  const handleEdit = (representative: Representative) => {
    setEditingRepresentative(representative);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: RepresentativeFormValues) => {
    let result;
    if (editingRepresentative) {
      result = await dispatch(
        updateRepresentative({ ...values, id: editingRepresentative.id })
      );
    } else {
      result = await dispatch(createRepresentative(values));
    }

    if (
      createRepresentative.fulfilled.match(result) ||
      updateRepresentative.fulfilled.match(result)
    ) {
      handleCloseModal();
    }
  };

  const getInitialValues = (): RepresentativeFormValues => {
    if (editingRepresentative) {
      return {
        dni: editingRepresentative.dni,
        names: editingRepresentative.names,
        last_names: editingRepresentative.last_names,
        phone: editingRepresentative.phone,
        email: editingRepresentative.email,
        address: editingRepresentative.address,
      };
    }
    return {
      dni: "",
      names: "",
      last_names: "",
      phone: "",
      email: null,
      address: null,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Representantes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona los representantes y acudientes de los estudiantes
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center text-white bg-primary rounded-lg text-sm font-bold gap-2 px-4 py-2.5 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
        >
          <Plus className="size-4" />
          Nuevo Representante
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <RepresentativeTable onEdit={handleEdit} />
      </div>

      <RepresentativeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={getInitialValues()}
        isEdit={!!editingRepresentative}
      />
    </div>
  );
}
