import { PackageSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import { orderService } from '../../services/orderService.js';
import { formatMoney } from '../../utils/formatters.js';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders()
      .then(setOrders)
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <section className="mx-auto max-w-5xl px-4 py-10"><div className="h-72 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" /></section>;
  }

  if (orders.length === 0) {
    return <section className="mx-auto max-w-5xl px-4 py-10"><EmptyState title="No orders yet" message="Completed checkout orders will appear here." /></section>;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Order History</h1>
      <div className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {orders.map((order) => (
          <Link key={order.id} className="grid gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800 sm:grid-cols-[1fr_auto]" to={`/orders/${order.id}`}>
            <div>
              <div className="flex items-center gap-3 font-black">
                <PackageSearch className="text-teal-600" size={20} />
                Order #{order.id}
              </div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {order.paymentStatus} · {order.orderStatus} · {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="text-xl font-black">{formatMoney(order.totalAmount)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
