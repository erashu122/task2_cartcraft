import { CheckCircle2, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import { orderService } from '../../services/orderService.js';
import { formatMoney } from '../../utils/formatters.js';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrder(id)
      .then(setOrder)
      .catch(() => toast.error('Could not load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <section className="mx-auto max-w-5xl px-4 py-10"><div className="h-72 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" /></section>;
  }

  if (!order) {
    return <section className="mx-auto max-w-5xl px-4 py-10"><EmptyState title="Order not found" /></section>;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link className="text-sm font-bold text-teal-700 dark:text-teal-300" to="/orders">Back to orders</Link>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-3xl font-black">Order #{order.id}</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm font-black text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
            {order.paymentStatus} / {order.orderStatus}
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800 sm:grid-cols-[72px_1fr_auto]">
              <img className="aspect-square rounded-lg object-cover" src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=300&q=80'} alt={item.product.title} />
              <div>
                <div className="font-black">{item.product.title}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity} / {formatMoney(item.price)}</div>
              </div>
              <div className="font-black">{formatMoney(item.lineTotal)}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between border-t border-slate-200 pt-6 text-2xl font-black dark:border-slate-800">
          <span>Total</span>
          <span>{formatMoney(order.totalAmount)}</span>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          {order.paymentStatus === 'PAID' ? <CheckCircle2 className="text-emerald-500" size={22} /> : <Package className="text-amber-500" size={22} />}
          Payments are confirmed only by Stripe webhook, never by frontend redirect.
        </div>
      </div>
    </section>
  );
}
