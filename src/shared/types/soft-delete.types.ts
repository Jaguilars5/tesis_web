/**
 * Types for the two-phase soft-delete flow with cascade confirmation.
 * Backend returns different shapes depending on whether confirmation is required.
 */

/** Response when confirmation is required (has active children) */
export interface SoftDeleteConfirmationRequiredT {
  requires_confirmation: true;
  affected_records: number;
  message: string;
  id: number;
  is_active: boolean;
}

/** Response when entity was deactivated (either directly or after confirmation) */
export interface SoftDeleteResultT {
  id: number;
  is_active: boolean;
  deactivated_records: number;
}

/** Union type for soft-delete responses */
export type SoftDeleteResponseT =
  | SoftDeleteConfirmationRequiredT
  | SoftDeleteResultT;

/** Type guard to check if confirmation is required */
export function requiresConfirmation(
  response: SoftDeleteResponseT,
): response is SoftDeleteConfirmationRequiredT {
  return "requires_confirmation" in response && response.requires_confirmation === true;
}

/** Type guard to check if deletion was successful */
export function isSoftDeleteSuccessful(
  response: SoftDeleteResponseT,
): response is SoftDeleteResultT {
  return "deactivated_records" in response ||
    ("is_active" in response && response.is_active === false && !("requires_confirmation" in response));
}

/** Parameters for soft-delete service calls */
export interface SoftDeleteParamsT {
  id: number;
  confirm?: boolean;
}
