"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import OrderCard from "@/components/order-card";
import TableAccountCard from "@/components/table-account-card";
import { useOrders } from "@/context/order-context";
import { getToken } from "@/utils/auth"; // Make sure this exists

export default function WaiterPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const { orders, updateOrderStatus, markTableAsCompleted, loading, refreshOrders } = useOrders();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTable, setSelectedTable] = useState("all");
  const [activeTab, setActiveTab] = useState("ready");

  // 🔐 Role check for 'ROLE_WAITER'
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

        if (!roles.includes("ROLE_WAITER")) {
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

  // ✅ Order logic remains the same
  const readyOrders =
      selectedTable === "all"
          ? orders.filter((order) => order.status === "ready")
          : orders.filter((order) => order.status === "ready" && order.tableId === Number.parseInt(selectedTable, 10));

  const tableIds = [...new Set(orders.filter((order) => order.status !== "completed").map((order) => order.tableId))].sort((a, b) => a - b);

  const tableAccounts = tableIds.map((tableId) => {
    const tableOrders = orders.filter((order) => order.tableId === tableId && order.status !== "completed");
    const totalAmount = tableOrders.reduce((sum, order) => sum + order.total, 0);
    return {
      tableId,
      orders: tableOrders,
      total: totalAmount,
    };
  });

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

  const handleCloseTable = async (tableId) => {
    await markTableAsCompleted(tableId);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log(`Waiter: Updating order ${orderId} to status ${newStatus}`);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Waiter Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-[120px] h-9">
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
            <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={handleRefresh}
                disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="ready" value={activeTab} onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="ready">Ready Orders</TabsTrigger>
            <TabsTrigger value="accounts">Table Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="ready" className="mt-0">
            <h2 className="text-lg font-medium mb-4">
              {selectedTable === "all"
                  ? "All Orders Ready for Delivery"
                  : `Orders Ready for Table ${selectedTable}`}
            </h2>

            {loading ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
            ) : readyOrders.length > 0 ? (
                <div className="space-y-4">
                  {readyOrders.map((order) => (
                      <OrderCard
                          key={order.id}
                          order={order}
                          onStatusChange={handleStatusChange}
                          availableActions={["delivered"]}
                      />
                  ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h2 className="text-xl font-medium mb-2">No orders ready for delivery</h2>
                  <p className="text-muted-foreground">
                    {selectedTable === "all"
                        ? "Ready orders will appear here"
                        : `No ready orders for Table ${selectedTable}`}
                  </p>
                </div>
            )}
          </TabsContent>

          <TabsContent value="accounts" className="mt-0">
            <h2 className="text-lg font-medium mb-4">Table Accounts</h2>

            {loading ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Loading table accounts...</p>
                </div>
            ) : tableAccounts.length > 0 ? (
                <div className="space-y-4">
                  {tableAccounts
                      .filter(
                          (account) =>
                              selectedTable === "all" || account.tableId === Number.parseInt(selectedTable, 10)
                      )
                      .map((account) => (
                          <TableAccountCard
                              key={account.tableId}
                              tableId={account.tableId}
                              orders={account.orders}
                              total={account.total}
                              onCloseTable={handleCloseTable}
                          />
                      ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h2 className="text-xl font-medium mb-2">No active tables</h2>
                  <p className="text-muted-foreground">Tables with active orders will appear here</p>
                </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
}
