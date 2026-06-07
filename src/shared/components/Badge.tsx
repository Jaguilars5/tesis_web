import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const variants = {
  default: "bg-primary text-white",
  secondary: "bg-slate-100 text-slate-700",
  destructive: "bg-red-600 text-white",
  outline: "border border-slate-300 text-slate-700",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
