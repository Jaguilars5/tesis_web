import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import { qualitativeScaleSublevelService } from "../qualitative-scale-sublevels.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectQualitativeScaleSublevels,
  selectTotalCount,
  selectQualitativeScaleSublevelsStatus,
  selectQualitativeScaleSublevelsError,
} from "../qualitative-scale-sublevels.slice";
import type {
  QualitativeScaleSublevelCreateParamsT,
  QualitativeScaleSublevelDeleteParamsT,
  QualitativeScaleSublevelListParamsT,
  QualitativeScaleSublevelT,
  QualitativeScaleSublevelUpdateParamsT,
} from "../qualitative-scale-sublevels.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export const useQualitativeScaleSublevelsController = () => {
  const dispatch = useAppDispatch();
  const qualitativeScaleSublevels = useAppSelector(selectQualitativeScaleSublevels);
  const totalCount = useAppSelector(selectTotalCount);
  const status = useAppSelector(selectQualitativeScaleSublevelsStatus);
  const error = useAppSelector(selectQualitativeScaleSublevelsError);

  const loadQualitativeScaleSublevels = useCallback(
    async (params?: QualitativeScaleSublevelListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await qualitativeScaleSublevelService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createQualitativeScaleSublevel = useCallback(
    async (data: QualitativeScaleSublevelCreateParamsT): Promise<QualitativeScaleSublevelT> => {
      try {
        const created = await qualitativeScaleSublevelService.create(data);
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

  const updateQualitativeScaleSublevel = useCallback(
    async (params: QualitativeScaleSublevelUpdateParamsT): Promise<QualitativeScaleSublevelT> => {
      try {
        const updated = await qualitativeScaleSublevelService.update(params);
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

  const deleteQualitativeScaleSublevel = useCallback(
    async (params: QualitativeScaleSublevelDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await qualitativeScaleSublevelService.softDelete(params);
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
    qualitativeScaleSublevels,
    totalCount,
    isLoading: status === "loading",
    error,
    loadQualitativeScaleSublevels,
    createQualitativeScaleSublevel,
    updateQualitativeScaleSublevel,
    deleteQualitativeScaleSublevel,
  };
};

export type QualitativeScaleSublevelsControllerT = ReturnType<
  typeof useQualitativeScaleSublevelsController
>;
