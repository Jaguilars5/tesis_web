import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { useCallback } from "react";
import { schoolYearService } from "../school-year.service";
import {
  selectSchoolYears,
  selectSchoolYearsStatus,
  selectSchoolYearError,
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
} from "../school-year.slice";
import type {
  SchoolYearListParamsT,
  SchoolYearCreateParamsT,
  SchoolYearT,
  SchoolYearUpdateParamsT,
  SchoolYearDeleteParamsT,
} from "../school-year.types";

export const useSchoolYearController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectSchoolYears);
  const status = useAppSelector(selectSchoolYearsStatus);
  const error = useAppSelector(selectSchoolYearError);

  const load = useCallback(
    async (params?: SchoolYearListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await schoolYearService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const create = useCallback(
    async (params: SchoolYearCreateParamsT): Promise<SchoolYearT> => {
      try {
        const newSchoolYear = await schoolYearService.create(params);
        dispatch(entityCreated(newSchoolYear));
        return newSchoolYear;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const update = useCallback(
    async (params: SchoolYearUpdateParamsT): Promise<SchoolYearT> => {
      try {
        const updateShoolYear = await schoolYearService.update(params);
        dispatch(entityUpdated(updateShoolYear));
        return updateShoolYear;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const disable = useCallback(
    async (params: SchoolYearDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await schoolYearService.softDelete(params);
        // Only dispatch entityDeleted when actually deactivated
        if (response.is_active === false) {
          dispatch(entityDeleted(response.id));
        }
        return response;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  return {
    schoolYears: items,
    isLoading: status === "loading",
    error,
    loadSchoolYears: load,
    createSchoolYear: create,
    updateSchoolYear: update,
    deleteSchoolYear: disable,
  };
};
