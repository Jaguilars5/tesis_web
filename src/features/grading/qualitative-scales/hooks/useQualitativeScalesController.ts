import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import { qualitativeScaleService } from "../qualitative-scales.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectQualitativeScales,
  selectQualitativeScalesStatus,
  selectQualitativeScalesError,
} from "../qualitative-scales.slice";
import type {
  QualitativeScaleCreateParamsT,
  QualitativeScaleDeleteParamsT,
  QualitativeScaleListParamsT,
  QualitativeScaleT,
  QualitativeScaleUpdateParamsT,
} from "../qualitative-scales.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export const useQualitativeScalesController = () => {
  const dispatch = useAppDispatch();
  const qualitativeScales = useAppSelector(selectQualitativeScales);
  const status = useAppSelector(selectQualitativeScalesStatus);
  const error = useAppSelector(selectQualitativeScalesError);

  const loadQualitativeScales = useCallback(
    async (params?: QualitativeScaleListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await qualitativeScaleService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createQualitativeScale = useCallback(
    async (data: QualitativeScaleCreateParamsT): Promise<QualitativeScaleT> => {
      try {
        const created = await qualitativeScaleService.create(data);
        dispatch(entityCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateQualitativeScale = useCallback(
    async (params: QualitativeScaleUpdateParamsT): Promise<QualitativeScaleT> => {
      try {
        const updated = await qualitativeScaleService.update(params);
        dispatch(entityUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteQualitativeScale = useCallback(
    async (params: QualitativeScaleDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await qualitativeScaleService.softDelete(params);
        if (response.is_active === false) {
          dispatch(entityDeleted(response.id));
        }
        return response;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  return {
    qualitativeScales,
    isLoading: status === "loading",
    error,
    loadQualitativeScales,
    createQualitativeScale,
    updateQualitativeScale,
    deleteQualitativeScale,
  };
};

export type QualitativeScalesControllerT = ReturnType<
  typeof useQualitativeScalesController
>;
