import { useRef } from "react";

import type { JSX } from "react";

import type { CustomTextAreaProps } from "./CustomTextAreaProps";

export const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  className = {},
  disabled,
  label,
  name,
  onBlur,
  onChange,
  placeholder,
  required,
  value,
  error,
  helperText,
  id,
  ...props
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const inputId = id || `text-area-${name}`;

  const renderHelperText = (): JSX.Element | null => {
    if (error) {
      return (
        <div className={className.error}>
          <span>{error}</span>
        </div>
      );
    }
    if (helperText) {
      return <p className={className.helperText}>{helperText}</p>;
    }
    return null;
  };

  return (
    <div className={className.container || "w-full"}>
      {label && (
        <label className={className.label} htmlFor={inputId}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div>
        <textarea
          ref={ref}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={error ? "true" : "false"}
          className={className.input}
          disabled={disabled}
          id={inputId}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          {...props}
        />
      </div>
      {renderHelperText()}
    </div>
  );
};
