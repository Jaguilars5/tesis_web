import React from "react";

export interface CustomInputClassNameProps {
  container?: string;
  input?: string;
  label?: string;
  error?: string;
  button?: string;
  helperText?: string;
}

export interface CustomInputProps {
  accept?: string;
  className?: CustomInputClassNameProps;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
  label?: string;
  max?: number | string;
  min?: number | string;
  name: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  step?: number;
  type: string;
  value: string | number;
  autoComplete?: string;
}
