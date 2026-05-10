import type { ReactNode } from "react";

interface AdminCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  description?: string;
}

export default function AdminCard({
  title,
  value,
  icon,
  trend,
  description,
}: AdminCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:bg-secondary/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="mt-4 flex items-center gap-1">
              <span
                className={
                  trend.positive
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
