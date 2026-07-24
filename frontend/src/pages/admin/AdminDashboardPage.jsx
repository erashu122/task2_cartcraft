import { AlertTriangle, BarChart3, PackageCheck, ShoppingBasket, Trophy, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService.js';
import { formatMoney } from '../../utils/formatters.js';

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(setDashboard)
      .catch(() => toast.error('Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    ['Revenue', formatMoney(dashboard?.revenue), BarChart3],
    ['Orders', dashboard?.totalOrders || 0, ShoppingBasket],
    ['Products', dashboard?.totalProducts || 0, PackageCheck],
    ['Customers', dashboard?.totalCustomers || 0, UsersRound],
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <Icon className="text-teal-300" size={28} />
            <div className="mt-6 text-sm text-slate-400">{label}</div>
            <div className="mt-1 text-3xl font-black">{loading ? '...' : value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Top Selling Products" icon={Trophy}>
          {dashboard?.topSellingProducts?.length ? dashboard.topSellingProducts.map((product) => (
            <Row key={product.productId} title={product.title} meta={`${product.unitsSold} units`} value={formatMoney(product.revenue)} />
          )) : <EmptyLine text="No paid sales yet." />}
        </Panel>

        <Panel title="Low Stock Alert" icon={AlertTriangle}>
          {dashboard?.lowStockProducts?.length ? dashboard.lowStockProducts.map((product) => (
            <Row key={product.productId} title={product.title} meta={product.categoryName} value={`${product.stock} left`} danger />
          )) : <EmptyLine text="Inventory levels look healthy." />}
        </Panel>
      </div>
    </section>
  );
}

function Panel({ children, icon: Icon, title }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3 text-xl font-black">
        <Icon className="text-teal-300" size={22} />
        {title}
      </div>
      <div className="mt-5 grid gap-3">{children}</div>
    </div>
  );
}

function Row({ title, meta, value, danger = false }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-white/10 bg-slate-950/40 p-4">
      <div>
        <div className="font-bold">{title}</div>
        <div className="mt-1 text-sm text-slate-400">{meta}</div>
      </div>
      <div className={danger ? 'font-black text-rose-300' : 'font-black text-teal-300'}>{value}</div>
    </div>
  );
}

function EmptyLine({ text }) {
  return <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-slate-400">{text}</div>;
}
