import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { orderService } from '../../services/orderService.js';
import { formatMoney } from '../../utils/formatters.js';

const statuses = ['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    orderService.getAdminOrders()
      .then(setOrders)
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const updated = await orderService.updateStatus(orderId, status);
      setOrders((current) => current.map((order) => (order.id === updated.id ? updated : order)));
      toast.success('Order status updated');
    } catch {
      toast.error('Could not update status');
    }
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Manage Orders</h1>
          <p className="mt-2 text-slate-400">Update fulfillment status after webhook-confirmed payment.</p>
        </div>
        <button className="btn-secondary px-3" onClick={loadOrders} aria-label="Refresh orders">
          <RefreshCcw size={18} />
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-[90px_1fr_140px_160px_160px] gap-4 border-b border-white/10 px-5 py-4 text-sm font-black text-slate-300">
          <span>ID</span>
          <span>Items</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Status</span>
        </div>
        {loading ? (
          <div className="p-8 text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-slate-400">No orders yet.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-[90px_1fr_140px_160px_160px] gap-4 px-5 py-4 text-sm">
                <span className="font-black">#{order.id}</span>
                <span>{order.items.length} items</span>
                <span className="font-bold">{formatMoney(order.totalAmount)}</span>
                <span>{order.paymentStatus}</span>
                <select className="input py-2" value={order.orderStatus} onChange={(event) => updateStatus(order.id, event.target.value)}>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
