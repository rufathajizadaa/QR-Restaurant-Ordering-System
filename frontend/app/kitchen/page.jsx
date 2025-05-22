'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import OrderCard from '@/components/order-card';
import { useOrders } from '@/context/order-context';
import { getToken } from '@/utils/auth'; // ensure this exists

export default function KitchenPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const { orders, updateOrderStatus, loading, refreshOrders } = useOrders();
  const [activeTab, setActiveTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTable, setSelectedTable] = useState('all');

  // Protect route on mount
  useEffect(() => {
    const verifyAccess = async () => {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        const roles = data.roles?.map((r) => r.authority) || [];

        if (!roles.includes('ROLE_KITCHEN')) {
          router.push('/unauthorized');
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      } finally {
        setLoadingUser(false);
      }
    };

    verifyAccess();
  }, []);

  if (loadingUser) {
    return <div className="text-center py-12">Checking authorization...</div>;
  }

  if (!authorized) return null;

  // Filter and logic below stays unchanged
  const filteredOrders =
      selectedTable === 'all'
          ? orders.filter((order) => order.status === activeTab)
          : orders.filter(
              (order) =>
                  order.status === activeTab &&
                  order.tableId === Number.parseInt(selectedTable, 10)
          );

  const tableIds = [...new Set(orders.map((order) => order.tableId))].sort((a, b) => a - b);

  const statusActions = {
    pending: ['preparing'],
    preparing: ['ready'],
    ready: [],
    delivered: []
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log(`Kitchen: Updating order ${orderId} to status ${newStatus}`);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
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
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="pending">Pending Orders</TabsTrigger>
            <TabsTrigger value="preparing">In Preparation</TabsTrigger>
          </TabsList>

          {['pending', 'preparing'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                {loading ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredOrders.map((order) => (
                          <OrderCard
                              key={order.id}
                              order={order}
                              onStatusChange={handleStatusChange}
                              availableActions={statusActions[tab]}
                          />
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <h2 className="text-xl font-medium mb-2">
                        {tab === 'pending' ? 'No pending orders' : 'No orders in preparation'}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedTable === 'all'
                            ? tab === 'pending'
                                ? 'New orders will appear here'
                                : 'Orders being prepared will appear here'
                            : `No ${tab} orders for Table ${selectedTable}`}
                      </p>
                    </div>
                )}
              </TabsContent>
          ))}
        </Tabs>
      </div>
  );
}
