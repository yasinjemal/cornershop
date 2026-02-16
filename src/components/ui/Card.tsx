// ============================================
// Card — reusable container card
// ============================================

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
