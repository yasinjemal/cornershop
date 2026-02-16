// ============================================
// Badge — small status/label pill
// ============================================

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
};

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusBadgeVariant(
  status: string
): NonNullable<BadgeProps["variant"]> {
  switch (status) {
    case "DELIVERED":
      return "success";
    case "SHIPPED":
    case "PROCESSING":
      return "info";
    case "CONFIRMED":
      return "warning";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
}
