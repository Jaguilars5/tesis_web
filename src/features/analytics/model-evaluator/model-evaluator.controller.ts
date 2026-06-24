import { useCallback, useState } from "react";
import { modelEvaluatorService } from "./model-evaluator.service";
import type { SimulateParamsT, SimulateResponseT } from "./model-evaluator.types";

export const useModelEvaluatorController = () => {
  const [result, setResult] = useState<SimulateResponseT | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback(async (params: SimulateParamsT) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await modelEvaluatorService.simulate(params);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al simular");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, evaluate, reset };
};

export type ModelEvaluatorControllerT = ReturnType<typeof useModelEvaluatorController>;
