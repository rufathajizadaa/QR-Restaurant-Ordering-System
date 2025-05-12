import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function OrderStatusBadge({ status }) {
  const statusClasses = {
    pending: "status-pending",
    preparing: "status-preparing",
    ready: "status-ready",
    delivered: "status-delivered",
    completed: "bg-gray-500 text-white",
  }

  const statusLabels = {
    pending: "Pending",
    preparing: "In Preparation",
    ready: "Ready",
    delivered: "Delivered",
    completed: "Completed",
  }

  return <Badge className={cn(statusClasses[status])}>{statusLabels[status]}</Badge>
}
