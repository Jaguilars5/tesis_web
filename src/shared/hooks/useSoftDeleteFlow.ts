import { useCallback, useEffect, useRef, useState } from "react";
import {
  requiresConfirmation,
  isSoftDeleteSuccessful,
  type SoftDeleteResponseT,
  type SoftDeleteParamsT,
} from "@shared/types/soft-delete.types";

export type SoftDeletePhase =
  | "idle"
  | "probing"
  | "confirm"
  | "deactivating"
  | "done"
  | "error";

interface UseSoftDeleteFlowArgs {
  isOpen: boolean;
  id: number | null;
  softDelete: (
    params: SoftDeleteParamsT,
  ) => Promise<SoftDeleteResponseT>;
}

interface UseSoftDeleteFlowResult {
  phase: SoftDeletePhase;
  message: string | null;
  affectedRecords: number | null;
  deactivatedRecords: number | null;
  errorMsg: string | null;
  confirm: () => Promise<void>;
  reset: () => void;
}

/**
 * Manages the two-phase soft-delete flow with cascade confirmation.
 *
 * Phase flow:
 * - idle: Initial state, no operation in progress
 * - probing: Checking if confirmation is required (POST without confirm)
 * - confirm: Backend requires confirmation, show message + affected count
 * - deactivating: Sending confirmation (POST with confirm: true)
 * - done: Successfully deactivated, show success
 * - error: An error occurred, show error message
 */
export function useSoftDeleteFlow({
  isOpen,
  id,
  softDelete,
}: UseSoftDeleteFlowArgs): UseSoftDeleteFlowResult {
  const [phase, setPhase] = useState<SoftDeletePhase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [affectedRecords, setAffectedRecords] = useState<number | null>(null);
  const [deactivatedRecords, setDeactivatedRecords] = useState<number | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Use refs to track probing state and avoid re-triggering
  const hasProbedRef = useRef(false);
  const pendingIdRef = useRef<number | null>(null);

  // Reset state when modal closes
  const reset = useCallback(() => {
    setPhase("idle");
    setMessage(null);
    setAffectedRecords(null);
    setDeactivatedRecords(null);
    setErrorMsg(null);
    hasProbedRef.current = false;
    pendingIdRef.current = null;
  }, []);

  // Handle modal closing - reset state
  useEffect(() => {
    if (!isOpen) {
      // Use RAF to batch with React's render cycle
      requestAnimationFrame(() => {
        reset();
      });
    }
  }, [isOpen, reset]);

  // Probe on modal open - trigger effect when isOpen changes to true
  useEffect(() => {
    if (!isOpen || id === null) {
      return;
    }

    // Avoid re-triggering if we already probed for this id
    if (hasProbedRef.current && pendingIdRef.current === id) {
      return;
    }

    // Capture id in local const for TypeScript
    const entityId = id;

    // Mark that we're starting a probe for this id
    hasProbedRef.current = true;
    pendingIdRef.current = entityId;

    let isActive = true;

    async function probe() {
      setPhase("probing");
      setErrorMsg(null);

      try {
        const response = await softDelete({ id: entityId });

        if (!isActive) return;

        if (requiresConfirmation(response)) {
          // Confirmation required - show message and affected records
          setPhase("confirm");
          setMessage(response.message);
          setAffectedRecords(response.affected_records);
        } else if (isSoftDeleteSuccessful(response)) {
          // Already deactivated (no children or already done)
          setPhase("done");
          setDeactivatedRecords(response.deactivated_records);
        } else {
          setPhase("error");
          setErrorMsg("Respuesta inesperada del servidor");
        }
      } catch (err) {
        if (!isActive) return;
        setPhase("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Error al verificar el estado",
        );
      }
    }

    probe();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, id]); // Intentionally exclude softDelete and phase

  // Confirm the soft-delete
  const confirm = useCallback(async () => {
    if (id === null || phase !== "confirm") return;

    setPhase("deactivating");

    try {
      const response = await softDelete({ id, confirm: true });

      if (isSoftDeleteSuccessful(response) && response.is_active === false) {
        setPhase("done");
        setDeactivatedRecords(response.deactivated_records);
      } else {
        setPhase("error");
        setErrorMsg("No se pudo desactivar el registro");
      }
    } catch (err) {
      setPhase("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Error al desactivar el registro",
      );
    }
  }, [id, phase, softDelete]);

  return {
    phase,
    message,
    affectedRecords,
    deactivatedRecords,
    errorMsg,
    confirm,
    reset,
  };
}
