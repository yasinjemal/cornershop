// ============================================
// Button — premium CTA system
// Primary = dark charcoal (authority)
// Gold = accent gold on dark backgrounds
// Secondary = outline (secondary actions)
// ============================================

import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
};

const variantStyles = {
  primary:
    "bg-cta text-white hover:bg-cta-hover focus-visible:ring-primary",
  gold:
    "bg-secondary text-white hover:bg-secondary-hover focus-visible:ring-secondary",
  secondary:
    "border border-border text-primary hover:border-border-hover hover:bg-surface-alt focus-visible:ring-primary",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  ghost:
    "text-muted hover:text-primary hover:bg-surface-alt focus-visible:ring-primary",
};

const sizeStyles = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-all duration-150 btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
