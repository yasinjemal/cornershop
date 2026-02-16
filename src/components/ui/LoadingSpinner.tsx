// ============================================
// LoadingSpinner — animated loading indicator
// ============================================

export default function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-secondary" />
    </div>
  );
}
