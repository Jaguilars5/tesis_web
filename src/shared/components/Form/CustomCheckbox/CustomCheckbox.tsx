import { forwardRef, useEffect, type JSX } from "react";

import type { CustomCheckboxProps } from "./CustomCheckboxProps";

export const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
  (
    {
      checked,
      onChange,
      onBlur,
      label,
      name,
      className = {},
      disabled = false,
      required = false,
      error,
      helperText,
      id,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${name}`;

    const renderHelperText = (): JSX.Element | null => {
      if (error) {
        return (
          <div className={className.error}>
            <span id={`${checkboxId}-error`}>{error}</span>
          </div>
        );
      }
      if (helperText) {
        return (
          <p className={className.helperText} id={`${checkboxId}-description`}>
            {helperText}
          </p>
        );
      }
      return null;
    };

    useEffect(() => {
      if (ref && typeof ref !== "function") {
        const element = ref.current;
        if (element) {
          element.indeterminate = indeterminate;
        }
      }
    }, [indeterminate, ref]);

    const getLabelComponent = (): JSX.Element | null =>
      label ? (
        <label className={className.label} htmlFor={checkboxId}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      ) : null;

    return (
      <div className={className.container}>
        {getLabelComponent()}

        <div className="flex items-center">
          <input
            ref={ref}
            aria-checked={indeterminate ? "mixed" : checked}
            aria-describedby={
              error
                ? `${checkboxId}-error`
                : helperText
                ? `${checkboxId}-description`
                : undefined
            }
            onBlur={onBlur}
            aria-invalid={error ? "true" : "false"}
            checked={checked}
            className={className.checkbox}
            disabled={disabled}
            id={checkboxId}
            name={name}
            required={required}
            type="checkbox"
            onChange={onChange}
            {...props}
          />
        </div>
        {renderHelperText()}
      </div>
    );
  }
);

CustomCheckbox.displayName = "CustomCheckbox";
