import { useEffect, useState } from 'react';
import { workOrderService } from '@/services/workOrderService';

export default function WorkOrderDebugPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching work orders...');
      const orders = await workOrderService.getAll();
      console.log('Work orders data:', orders);
      setWorkOrders(orders);
    } catch (err) {
      console.error('Error fetching work orders:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = async (id: string) => {
    try {
      setLoading(true);
      const orderDetails = await workOrderService.getById(id);
      setSelectedOrder(orderDetails);
    } catch (err) {
      console.error('Error fetching work order details:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Work Orders Debug Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Work Orders List</h2>
          {workOrders.map((order: any) => (
            <div 
              key={`${order.id}-${order.time_slots[0]?.entry_id || 'new'}`}
              className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleOrderClick(order.id)}
            >
              <div className="font-medium">Order ID: {order.id}</div>
              <div className="text-sm text-gray-600">
                Part Number: {order.part_number_code}
              </div>
              <div className="text-sm text-gray-600">
                Time Slots: {order.time_slots.length}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {order.time_slots.slice(0, 3).map((slot: any) => (
                  <div key={slot.entry_id}>
                    {slot.entry_date} - {slot.hour}
                  </div>
                ))}
                {order.time_slots.length > 3 && (
                  <div className="italic">
                    ...and {order.time_slots.length - 3} more slots
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedOrder && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <div className="border p-4 rounded">
              <div className="font-medium">Order ID: {selectedOrder.id}</div>
              <div className="text-sm text-gray-600 mt-2">
                Part Number: {selectedOrder.part_number_code}
              </div>
              <div className="mt-4">
                <div className="font-medium">Time Slots:</div>
                <div className="mt-2 space-y-1">
                  {selectedOrder.time_slots.map((slot: any) => (
                    <div 
                      key={slot.entry_id}
                      className="text-sm text-gray-600"
                    >
                      {slot.entry_date} - {slot.hour}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 