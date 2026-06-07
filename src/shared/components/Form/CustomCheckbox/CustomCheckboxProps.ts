interface CheckBoxClassNameProps {
  container?: string;
  checkbox?: string;
  label?: string;
  error?: string;
  helperText?: string;
}

export interface CustomCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  name: string;
  className?: CheckBoxClassNameProps;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
  indeterminate?: boolean;
}
