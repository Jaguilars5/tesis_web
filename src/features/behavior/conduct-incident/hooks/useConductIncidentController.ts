import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { conductIncidentService } from "../conduct-incident.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  currentLoaded,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectItems,
  selectStatus,
  selectError,
  selectCurrentConductIncident,
} from "../conduct-incident.slice";
import type {
  ConductIncidentListParamsT,
  ConductIncidentCreateParamsT,
  ConductIncidentT,
  ConductIncidentUpdateParamsT,
  ConductIncidentGetParamsT,
  ConductIncidentDeleteParamsT,
} from "../conduct-incident.types";

export const useConductIncidentController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const currentConductIncident = useAppSelector(selectCurrentConductIncident);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: ConductIncidentListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await conductIncidentService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(result));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar incidentes",
          ),
        );
      }
    },
    [dispatch],
  );

  const loadConductIncident = useCallback(
    async (params: ConductIncidentGetParamsT) => {
      try {
        const item = await conductIncidentService.get(params);
        dispatch(currentLoaded(item));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar incidente",
          ),
        );
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: ConductIncidentCreateParamsT): Promise<ConductIncidentT> => {
      try {
        const created = await conductIncidentService.create(params);
        dispatch(entityCreated(created));
        return created;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const updateItem = useCallback(
    async (params: ConductIncidentUpdateParamsT): Promise<ConductIncidentT> => {
      try {
        const updated = await conductIncidentService.update(params);
        dispatch(entityUpdated(updated));
        return updated;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const deleteItem = useCallback(
    async (params: ConductIncidentDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await conductIncidentService.softDelete(params);
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
    items,
    currentConductIncident,
    isLoading: status === "loading",
    error,
    loadItems,
    loadConductIncident,
    createItem,
    updateItem,
    deleteItem,
  };
};

export type ConductIncidentControllerT = ReturnType<typeof useConductIncidentController>;
