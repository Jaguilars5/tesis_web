import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback } from "react";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { sectionService } from "../section.service";
import {
  selectSections,
  selectSectionsStatus,
  selectSectionError,
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  mutationError,
  entityUpdated,
  entityDeleted,
} from "../section.slice";
import type {
  SectionListParamsT,
  SectionCreateParamsT,
  SectionT,
  SectionUpdateParamsT,
  SectionDeleteParamsT,
} from "../section.types";

export const useSectionController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectSections);
  const status = useAppSelector(selectSectionsStatus);
  const error = useAppSelector(selectSectionError);

  const load = useCallback(
    async (params?: SectionListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await sectionService.list(
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
    async (params: SectionCreateParamsT): Promise<SectionT> => {
      try {
        const newSection = await sectionService.create(params);
        dispatch(entityCreated(newSection));
        return newSection;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const update = useCallback(
    async (params: SectionUpdateParamsT): Promise<SectionT> => {
      try {
        const updatedSection = await sectionService.update(params);
        dispatch(entityUpdated(updatedSection));
        return updatedSection;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const disable = useCallback(
    async (params: SectionDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await sectionService.softDelete(params);
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
    sections: items,
    isLoading: status === "loading",
    error,
    loadSections: load,
    createSection: create,
    updateSection: update,
    deleteSection: disable,
  };
};
