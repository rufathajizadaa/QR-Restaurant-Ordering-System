"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


import ManagerOrderCard from "@/components/manager-order-card";
import { useOrders } from "@/context/order-context";
import { getToken } from "@/utils/auth";

export default function ManagerPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const { orders, loading, refreshOrders } = useOrders();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTable, setSelectedTable] = useState("all");
  const [includeCompleted, setIncludeCompleted] = useState(false);

  // 🔐 Role-based access check
  useEffect(() => {
    const verifyAccess = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        const roles = data.roles?.map((r) => r.authority) || [];

        if (!roles.includes("ROLE_ADMIN")) {
          router.push("/unauthorized");
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error("Access check failed:", err);
        router.push("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    verifyAccess();
  }, []);

  if (loadingUser) return <div className="text-center py-12">Checking access...</div>;
  if (!authorized) return null;

  // 💡 Filtering & computation logic remains unchanged
  const filteredOrders = orders.filter((order) => {
    const tableMatch = selectedTable === "all" || order.tableId === Number.parseInt(selectedTable, 10);
    const statusMatch = includeCompleted || order.status !== "completed";
    return tableMatch && statusMatch;
  });

  const orderCounts = {
    pending: filteredOrders.filter((order) => order.status === "pending").length,
    preparing: filteredOrders.filter((order) => order.status === "preparing").length,
    ready: filteredOrders.filter((order) => order.status === "ready").length,
    delivered: filteredOrders.filter((order) => order.status === "delivered").length,
    completed: filteredOrders.filter((order) => order.status === "completed").length,
  };

  const totalRevenue = filteredOrders
      .filter((order) => ["delivered", "completed"].includes(order.status))
      .reduce((sum, order) => sum + order.total, 0);

  const tableIds = [...new Set(orders.map((order) => order.tableId))].sort((a, b) => a - b);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                {tableIds.map((id) => (
                    <SelectItem key={id} value={id.toString()}>
                      Table {id}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/register">
              <Button variant="default" size="sm" className="whitespace-nowrap">
                Create Account
              </Button>
            </Link>
            <Button
                variant={includeCompleted ? "default" : "outline"}
                size="sm"
                onClick={() => setIncludeCompleted(!includeCompleted)}
            >
              {includeCompleted ? "Hide Completed" : "Show Completed"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{filteredOrders.length}</div><div className="text-xs text-muted-foreground">{selectedTable === "all" ? "All tables" : `Table ${selectedTable}`}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div><div className="text-xs text-muted-foreground">From delivered/completed orders</div></CardContent></Card>
          <Card className="bg-amber-50 border-amber-200"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-amber-700">Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-amber-700">{orderCounts.pending}</div></CardContent></Card>
          <Card className="bg-blue-50 border-blue-200"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-700">Preparing</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-700">{orderCounts.preparing}</div></CardContent></Card>
        </div>

        {/* More summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-700">Ready</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-700">{orderCounts.ready}</div></CardContent></Card>
          <Card className="bg-purple-50 border-purple-200"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-purple-700">Delivered</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-purple-700">{orderCounts.delivered}</div></CardContent></Card>
          {includeCompleted && (
              <Card className="bg-gray-50 border-gray-200"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-700">Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-gray-700">{orderCounts.completed}</div></CardContent></Card>
          )}
        </div>

        <h2 className="text-lg font-medium mb-4">
          {selectedTable === "all" ? "All Orders" : `Orders for Table ${selectedTable}`}
        </h2>

        {loading ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
        ) : (
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-6 w-full mb-4 overflow-x-auto">
                {["all", "pending", "preparing", "ready", "delivered", ...(includeCompleted ? ["completed"] : [])].map(
                    (status) => (
                        <TabsTrigger key={status} value={status} className="text-xs capitalize">
                          {status}
                        </TabsTrigger>
                    )
                )}
              </TabsList>

              {["all", "pending", "preparing", "ready", "delivered", "completed"].map((status) => {
                if (status === "completed" && !includeCompleted) return null;

                const ordersToDisplay =
                    status === "all" ? filteredOrders : filteredOrders.filter((order) => order.status === status);

                return (
                    <TabsContent key={status} value={status} className="mt-0 space-y-4">
                      {ordersToDisplay.length > 0 ? (
                          ordersToDisplay.map((order) => <ManagerOrderCard key={order.id} order={order} />)
                      ) : (
                          <div className="text-center py-8 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">No {status} orders</p>
                          </div>
                      )}
                    </TabsContent>
                );
              })}
            </Tabs>
        )}
      </div>
  );
}
