import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { AlertTriangle } from "lucide-react";

export const ErrrosInForm: React.FC<{
  submitErrors: SubmitErrorState;
  getFieldLabel: (f: string) => string;
}> = ({ submitErrors, getFieldLabel }) => {
  return (
    <div className="mx-5 mt-3 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <AlertTriangle className="size-5 text-red-600" />
        <div className="flex-1">
          <p className="mb-2 text-sm font-semibold text-red-800">
            Error al guardar
          </p>
          {submitErrors.general.length > 0 && (
            <ul>
              {submitErrors.general.map((e, i) => (
                <li key={i} className="text-sm text-red-700">
                  • {e}
                </li>
              ))}
            </ul>
          )}
          {Object.keys(submitErrors.validation).length > 0 && (
            <ul>
              {Object.entries(submitErrors.validation).map(([f, m]) => (
                <li key={f} className="text-sm text-red-700">
                  <span className="font-semibold">{getFieldLabel(f)}:</span> {m}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
