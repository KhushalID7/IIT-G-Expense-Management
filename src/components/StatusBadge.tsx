import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, Circle } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "submitted";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-pending/10 text-pending border-pending/20",
    },
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-success/10 text-success border-success/20",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    submitted: {
      label: "Submitted",
      icon: Circle,
      className: "bg-accent/10 text-accent border-accent/20",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all",
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
