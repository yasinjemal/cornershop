// ============================================
// StatCard — dashboard metric card
// ============================================

import Card from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: string;
  subtext?: string;
};

export default function StatCard({ label, value, icon, subtext }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
          {subtext && (
            <p className="mt-1 text-xs text-muted-light">{subtext}</p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Card>
  );
}
