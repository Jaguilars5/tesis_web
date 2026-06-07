import type { TypeIcon } from "lucide-react";

export interface SelectOptionT {
  value: string | number;
  label: string;
  icon?: typeof TypeIcon;
  className?: string;
}

export interface CustomMultiSelectClassNameProps {
  container?: string;
  label?: string;
  select?: string;
  option?: string;
  error?: string;
}

export type DropdownDirectionMuliST = "up" | "down";

export interface CustomMultiSelectProps {
  options: SelectOptionT[];
  onChange: (option: SelectOptionT) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: CustomMultiSelectClassNameProps;
  required?: boolean;
  name: string;
  value: string | number;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
  dropdownDirection?: DropdownDirectionMuliST;
  setSearchQuery?: (query: string) => void;
  defaultSearch?: string;
  loadingOptions?: boolean;
  noMatchButton?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
  origin?: string;
  autoReset?: {
    enabled: boolean;
    delay?: number; // tiempo en milisegundos
    resetValue?: string | number;
    onReset?: () => void;
  };
}
