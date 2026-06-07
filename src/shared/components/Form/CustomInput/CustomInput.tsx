import { Eye, EyeOff } from "lucide-react";
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type JSX,
} from "react";

import type { CustomInputProps } from "./CustomInputProps";

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className = {},
      disabled,
      label,
      max,
      min,
      name,
      onBlur,
      onChange,
      onKeyDown,
      placeholder,
      required,
      type,
      value,
      error,
      helperText,
      accept = "image/jpeg, image/png, image/jpg",
      id,
      step,
      autoComplete,
      ...props
    },
    forwardedRef,
  ) => {
    const leInputRef = useRef<HTMLInputElement>(null);
    const internalRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${name}`;

    // Exponer el ref interno al padre
    useImperativeHandle(forwardedRef, () => internalRef.current!, []);

    const handleButtonClick = (): void => {
      if (leInputRef.current) {
        leInputRef.current.click();
      }
    };

    const togglePasswordVisibility = (): void => {
      setShowPassword((prev) => !prev);
    };

    const renderHelperText = (): JSX.Element | null => {
      if (error) {
        return (
          <div className={className.error} id={`${inputId}-error`}>
            <span>{error}</span>
          </div>
        );
      }
      if (helperText) {
        return <p className={className.helperText}>{helperText}</p>;
      }
      return null;
    };

    // Determina el tipo real a renderizar (para toggle de password)
    const renderedType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className={className.container || "w-full"}>
        {label && (
          <label className={className.label} htmlFor={inputId}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {type === "le" ? (
          <div className="flex flex-col gap-2">
            <input
              ref={leInputRef}
              accept={accept}
              aria-describedby={error ? `${inputId}-error` : undefined}
              className="hidden"
              disabled={disabled}
              id={inputId}
              name={name}
              required={required}
              type="le"
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              autoComplete={autoComplete}
              {...props}
            />
            <button
              className={className.button}
              disabled={disabled}
              type="button"
              onClick={handleButtonClick}
            >
              Seleccionar archivo
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              ref={internalRef}
              aria-describedby={error ? `${inputId}-error` : undefined}
              aria-invalid={error ? "true" : "false"}
              className={`${className.input} ${
                type === "password" ? "pr-10" : ""
              }`}
              disabled={disabled}
              id={inputId}
              max={max}
              min={min}
              name={name}
              placeholder={placeholder}
              required={required}
              step={step}
              type={renderedType}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              autoComplete={autoComplete}
              {...props}
            />

            {type === "password" && (
              <button
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                tabIndex={-1}
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        )}

        {renderHelperText()}
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";
