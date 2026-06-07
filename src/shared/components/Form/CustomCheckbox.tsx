import type { InputHTMLAttributes } from 'react'

type CustomCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> & {
  name: string
  label: string
  error?: string
  containerClassName?: string
}

export function CustomCheckbox({ label, error, containerClassName = '', id, name, ...props }: CustomCheckboxProps) {
  const checkboxId = id ?? name

  return (
    <div className={containerClassName}>
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-500 transition hover:border-primary hover:bg-indigo-50"
      >
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          className="mt-1 size-4 accent-primary"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p className="mt-1 text-xs font-semibold text-danger" id={`${checkboxId}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
