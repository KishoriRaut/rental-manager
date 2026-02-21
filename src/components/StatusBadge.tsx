import { Badge } from "@/components/ui/badge";

type Status = "paid" | "partial" | "unpaid";

const statusConfig: Record<Status, { label: string; className: string }> = {
  paid: { label: "Paid", className: "status-paid border-0 font-medium" },
  partial: { label: "Partial", className: "status-partial border-0 font-medium" },
  unpaid: { label: "Unpaid", className: "status-unpaid border-0 font-medium" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
