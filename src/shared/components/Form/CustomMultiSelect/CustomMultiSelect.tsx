import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useClickOutside } from "./useClickOutside";

import type { JSX } from "react";

import type {
  CustomMultiSelectClassNameProps,
  SelectOptionT,
} from "./CustomMultiSelectProps";

export interface MultiSelectProps {
  options: SelectOptionT[];
  onChange: (options: SelectOptionT[]) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: CustomMultiSelectClassNameProps;
  required?: boolean;
  name: string;
  value: (string | number)[];
  disabled?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
}
export const CustomMultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onChange,
  placeholder = "Seleccione una o más opciones",
  className = {},
  label,
  name,
  required,
  value,
  disabled,
  error,
  helperText,
  onBlur,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedOptions, setSelectedOptions] = useState<SelectOptionT[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectId = id || `multi-select-${name}`;
  const listboxId = `${selectId}-listbox`;

  const iconColor = className.select
    ?.split(" ")
    .find(
      (classItem) => classItem.startsWith("border-") && classItem !== "border"
    )
    ?.replace("border-", "text-");

  // Sincronizar el estado inicial con las opciones seleccionadas desde `value`.
  useEffect(() => {
    const initialSelected = options.filter((opt) => value.includes(opt.value));
    setSelectedOptions(initialSelected);
  }, [value, options]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useClickOutside({
    ref: containerRef,
    onClickOutside: () => setIsOpen(false),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const toggleSelectOption = (option: SelectOptionT): void => {
    let updatedSelectedOptions: SelectOptionT[];
    if (selectedOptions.find((opt) => opt.value === option.value)) {
      updatedSelectedOptions = selectedOptions.filter(
        (opt) => opt.value !== option.value
      );
    } else {
      updatedSelectedOptions = [...selectedOptions, option];
    }
    setSelectedOptions(updatedSelectedOptions);
    onChange(updatedSelectedOptions);
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
          toggleSelectOption(filteredOptions[highlightedIndex]);
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

  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      // Usar requestAnimationFrame para evitar forced reflows
      requestAnimationFrame(() => {
        if (listRef.current && highlightedIndex >= 0) {
          const element = listRef.current.children[
            highlightedIndex
          ] as HTMLElement;
          if (element) {
            element.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }
        }
      });
    }
  }, [highlightedIndex, isOpen]);

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
    <div ref={containerRef} className={className.container || "w-full"}>
      {label && (
        <label
          className={
            className.label ||
            "block text-sm font-medium text-gray-700 dark:text-gray-900"
          }
          htmlFor={selectId}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          className={`flex items-center justify-between rounded p-2 ${className.select}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap items-center gap-1">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="flex items-center gap-1 rounded bg-indigo-100 px-2 py-1 text-sm text-indigo-600"
              >
                {option.icon && <option.icon className="mr-1" />}
                {option.label}
                <button
                  className="ml-1 text-indigo-700 hover:text-indigo-900"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectOption(option);
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            ref={inputRef}
            aria-controls={listboxId}
            className="w-full bg-transparent focus:outline-none disabled:cursor-not-allowed"
            disabled={disabled}
            id={selectId}
            name={name}
            placeholder={
              selectedOptions.length === 0 ? placeholder : "Agregar más..."
            }
            required={required && selectedOptions.length === 0}
            role="combobox"
            type="text"
            value={searchTerm}
            onBlur={onBlur}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
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
            className="aolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto rounded border bg-white shadow-lg"
            id={listboxId}
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <li className="p-2 text-center text-gray-500">
                No hay resultados
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  aria-selected={selectedOptions.some(
                    (opt) => opt.value === option.value
                  )}
                  className={`flex cursor-pointer items-center p-2 ${
                    selectedOptions.some((opt) => opt.value === option.value)
                      ? "bg-indigo-100"
                      : ""
                  } ${
                    highlightedIndex === index ? "bg-indigo-50" : ""
                  } hover:bg-gray-100`}
                  id={`${selectId}-option-${index}`}
                  role="option"
                  onClick={() => toggleSelectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.icon && <option.icon className="mr-2" />}
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {renderHelperText()}
    </div>
  );
};
