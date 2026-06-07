import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { normalizeText } from "./normalizeText";
import { Spinner } from "./Spinner";
import { useClickOutside } from "./useClickOutside";

import type { JSX } from "react";

import type {
  CustomSelectProps,
  DropdownDirectionT,
  SelectOptionT,
} from "./CustomSelectProps";

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChange,
  onBlur,
  placeholder = "Seleccione una opción",
  className = {},
  label,
  name,
  required,
  value,
  disabled,
  error,
  helperText,
  id,
  setSearchQuery,
  defaultSearch,
  dropdownDirection,
  noMatchButton,
  loadingOptions = false,
  // origin,
  autoReset,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<SelectOptionT | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>(defaultSearch || "");
  const [filteredOptions, setFilteredOptions] =
    useState<SelectOptionT[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [dropdownDir, setDropdownDir] = useState<DropdownDirectionT>(
    dropdownDirection || "down"
  );
  const [autoResetTimeout, setAutoResetTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectId = id || `select-${name}`;
  const listboxId = `${selectId}-listbox`;

  const iconColor = className.select
    ?.split(" ")
    .find(
      (classItem) => classItem.startsWith("border-") && classItem !== "border"
    )
    ?.replace("border-", "text-");

  useEffect(() => {
    // Al abrir el dropdown, siempre mostrar todas las opciones
    if (isOpen) {
      setFilteredOptions(options);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Si el input está vacío y el dropdown está cerrado, sincronizar opciones
    if (!searchTerm && !isOpen) {
      setFilteredOptions(options);
    }
  }, [options, searchTerm, isOpen]);

  useEffect(() => {
    const option = options.find((opt) => opt.value === value);

    if (searchTerm === defaultSearch) return;

    if (option) {
      setSelectedOption(option);
      setSearchTerm(option.label);
      if (setSearchQuery) setSearchQuery(option.label);
    }
  }, [value, options, defaultSearch, searchTerm]);

  useClickOutside({
    ref: containerRef,
    onClickOutside: () => setIsOpen(false),
  });

  // Detecta si hay espacio suficiente abajo, si no abre hacia arriba
  useEffect(() => {
    if (!isOpen) return;
    if (dropdownDirection) {
      setDropdownDir(dropdownDirection);
      return;
    }
    if (containerRef.current) {
      // Usar requestAnimationFrame para evitar forced reflows
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();

          const windowHeight = window.innerHeight;

          const spaceBelow = windowHeight - rect.bottom;

          const dropdownHeight = Math.min(filteredOptions.length * 50, 240);

          if (spaceBelow < dropdownHeight + 20) {
            setDropdownDir("up");
          } else {
            setDropdownDir("down");
          }
        }
      });
    }
  }, [isOpen, filteredOptions.length, dropdownDirection]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    if (setSearchQuery) setSearchQuery(inputValue);
    const filtered: SelectOptionT[] = options.filter(
      (option: SelectOptionT) => {
        return normalizeText(option.label).includes(normalizeText(inputValue));
      }
    );

    setFilteredOptions(filtered);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectOption = (option: SelectOptionT): void => {
    setSelectedOption(option);
    setSearchTerm(option.label);
    setIsOpen(false);
    onChange(option);
    inputRef.current?.blur();

    // Configurar auto-reset si está habilitado
    if (autoReset?.enabled) {
      // Limpiar timeout anterior si existe
      if (autoResetTimeout) {
        clearTimeout(autoResetTimeout);
      }

      // Configurar nuevo timeout
      const timeout = setTimeout(() => {
        const resetValue = autoReset.resetValue ?? "";
        const resetOption = options.find((opt) => opt.value === resetValue);

        if (resetOption) {
          setSelectedOption(resetOption);
          setSearchTerm(resetOption.label);
        } else {
          setSelectedOption(null);
          setSearchTerm("");
        }

        // Llamar callback de reset si existe
        if (autoReset.onReset) {
          autoReset.onReset();
        }

        setAutoResetTimeout(null);
      }, autoReset.delay ?? 3000);

      setAutoResetTimeout(timeout);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  // useEffect(() => {
  //   if (isOpen && listRef.current && highlightedIndex >= 0) {
  //     const element = listRef.current.children[highlightedIndex] as HTMLElement;
  //     element.scrollIntoView({ block: "nearest" });
  //   }
  // }, [highlightedIndex, isOpen]);

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return (): void => {
      if (autoResetTimeout) {
        clearTimeout(autoResetTimeout);
      }
    };
  }, [autoResetTimeout]);

  const renderHelperText = (): JSX.Element | null => {
    if (error) {
      return (
        <div
          className={
            className.error || "mt-1 flex items-center text-sm text-red-500"
          }
        >
          <span id={`${selectId}-error`}>{error}</span>
        </div>
      );
    }
    if (helperText) {
      return (
        <p
          className="mt-1 text-sm text-gray-500"
          id={`${selectId}-description`}
        >
          {helperText}
        </p>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className={className.container}>
      {label && (
        <label className={className.label} htmlFor={selectId}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          className={`flex items-center justify-between rounded p-2 ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          } ${className.select} `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex min-w-0 grow items-center space-x-2">
            {selectedOption?.icon && <selectedOption.icon />}
            <input
              ref={inputRef}
              aria-activedescendant={
                highlightedIndex >= 0
                  ? `${selectId}-option-${highlightedIndex}`
                  : undefined
              }
              aria-controls={listboxId}
              aria-describedby={
                error
                  ? `${selectId}-error`
                  : helperText
                  ? `${selectId}-description`
                  : undefined
              }
              aria-expanded={isOpen}
              aria-invalid={error ? "true" : "false"}
              className="w-full bg-transparent focus:outline-none disabled:cursor-not-allowed"
              disabled={disabled}
              id={selectId}
              name={name}
              placeholder={placeholder}
              required={required}
              role="combobox"
              type="text"
              value={searchTerm}
              onBlur={onBlur}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          {isOpen ? (
            <ChevronUp className={`ml-2 h-4 w-4 shrink-0 ${iconColor || ""}`} />
          ) : (
            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 ${iconColor || ""}`}
            />
          )}
        </div>

        {isOpen && (
          <ul
            ref={listRef}
            aria-label={label || "Opciones"}
            className={`aolute left-0 right-0 z-10 max-h-60 overflow-y-auto rounded border bg-white shadow-lg ${
              dropdownDir === "up" ? "bottom-full mb-1" : "mt-1"
            }`}
            id={listboxId}
            role="listbox"
          >
            {loadingOptions ? (
              <li
                className={`flex cursor-pointer items-center justify-center p-2`}
                role="option"
              >
                <Spinner />
              </li>
            ) : (
              <>
                {filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    aria-selected={selectedOption?.value === option.value}
                    className={`flex cursor-pointer items-center p-2 ${
                      option.className || ""
                    } ${className.option || ""}`}
                    id={`${selectId}-option-${index}`}
                    role="option"
                    onClick={() => handleSelectOption(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option.icon && <option.icon className="mr-2" />}
                    {option.label}
                  </li>
                ))}
                {filteredOptions.length <= 3 && noMatchButton ? (
                  <li
                    className={`flex cursor-pointer items-center justify-center p-2 ${
                      noMatchButton.className || ""
                    }`}
                    role="option"
                    onClick={() => {
                      if (searchTerm) {
                        noMatchButton.onClick();
                        setIsOpen(false);
                      }
                    }}
                  >
                    {noMatchButton.label}
                  </li>
                ) : (
                  filteredOptions.length === 0 &&
                  searchTerm && (
                    <>
                      {
                        <li className="p-2 text-center text-gray-500">
                          No hay resultados
                        </li>
                      }
                    </>
                  )
                )}
              </>
            )}
          </ul>
        )}
      </div>
      {renderHelperText()}
    </div>
  );
};
