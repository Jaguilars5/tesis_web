import React from "react";

export interface CustomTextAreaClassNameProps {
  container?: string;
  input?: string;
  label?: string;
  error?: string;
  helperText?: string;
}

export interface CustomTextAreaProps {
  className?: CustomTextAreaClassNameProps;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
  label?: string;
  name: string;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
  rows?: number;
}
