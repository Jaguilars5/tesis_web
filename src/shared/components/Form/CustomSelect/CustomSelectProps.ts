import type { TypeIcon } from "lucide-react";

export interface SelectOptionT {
  value: string | number;
  label: string;
  icon?: typeof TypeIcon;
  className?: string;
}

export interface CustomSelectClassNameProps {
  container?: string;
  label?: string;
  select?: string;
  option?: string;
  error?: string;
}

export type DropdownDirectionT = "up" | "down";

export interface CustomSelectProps {
  options: SelectOptionT[];
  onChange: (option: SelectOptionT) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: CustomSelectClassNameProps;
  required?: boolean;
  name: string;
  value: string | number;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
  dropdownDirection?: DropdownDirectionT;
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
