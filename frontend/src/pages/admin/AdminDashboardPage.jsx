import { BarChart3, PackageCheck, ShoppingBasket, UsersRound } from 'lucide-react';

const metrics = [
  ['Revenue', '$0.00', BarChart3],
  ['Orders', '0', ShoppingBasket],
  ['Products', '0', PackageCheck],
  ['Customers', '0', UsersRound],
];

export default function AdminDashboardPage() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <Icon className="text-teal-300" size={28} />
            <div className="mt-6 text-sm text-slate-400">{label}</div>
            <div className="mt-1 text-3xl font-black">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
