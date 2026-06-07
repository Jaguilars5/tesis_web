import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectQualitativeScalesError,
  selectQualitativeScales,
  selectQualitativeScalesStatus,
} from "../../reducers/qualitative-scales.selectors";
import {
  createQualitativeScale,
  deleteQualitativeScale,
  fetchQualitativeScale,
  fetchQualitativeScales,
  updateQualitativeScale,
} from "../../reducers/qualitative-scales.thunks";
import type { QualitativeScaleListParamsT } from "../../domain/repositories/qualitative-scales.repository";

export const useQualitativeScalesController = () => {
  const dispatch = useAppDispatch();
  const qualitativeScales = useAppSelector(selectQualitativeScales);
  const status = useAppSelector(selectQualitativeScalesStatus);
  const error = useAppSelector(selectQualitativeScalesError);

  const loadQualitativeScales = useCallback(
    (params?: QualitativeScaleListParamsT) => {
      return dispatch(fetchQualitativeScales(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getQualitativeScale = useCallback(
    (id: number) => {
      return dispatch(fetchQualitativeScale(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createQualitativeScale>[0], "id">) => {
      return dispatch(createQualitativeScale(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updateQualitativeScale>[0]> & { id: number }) => {
      return dispatch(updateQualitativeScale(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteQualitativeScale(id));
    },
    [dispatch],
  );

  return {
    qualitativeScales,
    isLoading: status === "loading",
    error,
    loadQualitativeScales,
    getQualitativeScale,
    createQualitativeScale: create,
    updateQualitativeScale: update,
    deleteQualitativeScale: remove,
  };
};
