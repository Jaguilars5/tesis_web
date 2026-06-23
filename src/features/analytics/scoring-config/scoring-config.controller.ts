import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback } from "react";

import { scoringConfigService } from "./scoring-config.service";
import {
  clearError,
  configSaved,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectScoringConfig,
  selectScoringConfigError,
  selectScoringConfigStatus,
} from "./scoring-config.slice";
import type {
  RiskScoringConfigT,
  ScoringConfigUpdateDataT,
  ScoringPresetT,
} from "./scoring-config.types";

export const useScoringConfigController = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectScoringConfig);
  const status = useAppSelector(selectScoringConfigStatus);
  const error = useAppSelector(selectScoringConfigError);

  const loadConfig = useCallback(async () => {
    dispatch(loadPending());
    try {
      const data = await scoringConfigService.get();
      dispatch(loadSuccess(data));
    } catch (err) {
      dispatch(
        loadError(
          err instanceof Error ? err.message : "Error al cargar la configuración",
        ),
      );
    }
  }, [dispatch]);

  const save = useCallback(
    async (data: ScoringConfigUpdateDataT): Promise<RiskScoringConfigT> => {
      try {
        const updated = await scoringConfigService.update(data);
        dispatch(configSaved(updated));
        return updated;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar";
        dispatch(mutationError(msg));
        throw err;
      }
    },
    [dispatch],
  );

  const applyPreset = useCallback(
    async (preset: ScoringPresetT): Promise<RiskScoringConfigT> => {
      try {
        const updated = await scoringConfigService.applyPreset(preset);
        dispatch(configSaved(updated));
        return updated;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al aplicar el preset";
        dispatch(mutationError(msg));
        throw err;
      }
    },
    [dispatch],
  );

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    config,
    isLoading: status === "loading",
    error,
    loadConfig,
    save,
    applyPreset,
    resetError,
  };
};

export type ScoringConfigControllerT = ReturnType<
  typeof useScoringConfigController
>;
