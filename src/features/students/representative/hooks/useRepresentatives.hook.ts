import { useAppDispatch } from "@shared/redux/hooks";
import { useCallback } from "react";
import {
  createRepresentative,
  deleteRepresentative,
  fetchRepresentatives,
  updateRepresentative,
} from "../redux/representative.thunks";
import type {
  RepresentativeCreateRequest,
  RepresentativeUpdateRequest,
} from "../types/representative.types";

export function useRepresentatives() {
  const dispatch = useAppDispatch();

  const loadRepresentatives = useCallback(() => {
    return dispatch(fetchRepresentatives());
  }, [dispatch]);

  const createRepresentativeMutation = useCallback(
    (data: RepresentativeCreateRequest) => {
      return dispatch(createRepresentative(data));
    },
    [dispatch]
  );

  const updateRepresentativeMutation = useCallback(
    (data: RepresentativeUpdateRequest) => {
      return dispatch(updateRepresentative(data));
    },
    [dispatch]
  );

  const deleteRepresentativeMutation = useCallback(
    (id: number) => {
      return dispatch(deleteRepresentative({ id }));
    },
    [dispatch]
  );

  return {
    loadRepresentatives,
    createRepresentative: createRepresentativeMutation,
    updateRepresentative: updateRepresentativeMutation,
    deleteRepresentative: deleteRepresentativeMutation,
  };
}

export function useRepresentativeForm() {
  const { createRepresentative, updateRepresentative } = useRepresentatives();

  const handleSubmit = useCallback(
    async (values: RepresentativeCreateRequest, editingId?: number) => {
      if (editingId) {
        return updateRepresentative({ ...values, id: editingId });
      }
      return createRepresentative(values);
    },
    [createRepresentative, updateRepresentative]
  );

  return { handleSubmit };
}
