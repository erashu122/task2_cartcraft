import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.22),transparent_34%),linear-gradient(135deg,#f8fafc,#eef6f6_45%,#fff7ed)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#020617,#111827_55%,#1e293b)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-white/70 px-4 py-2 text-sm font-semibold text-teal-700 backdrop-blur dark:bg-slate-900/60 dark:text-teal-300">
            <Sparkles size={16} /> Curated commerce, crafted checkout
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-normal text-slate-950 dark:text-white sm:text-6xl">
            CartCraft
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A secure, fast, and refined storefront foundation with customer accounts, RBAC, and a Stripe-ready order pipeline.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/products">
              Start shopping <ArrowRight size={18} />
            </Link>
            <Link className="btn-secondary" to="/login">Sign in</Link>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Secure JWT', ShieldCheck],
              ['Fast Delivery', Truck],
              ['Smart Picks', Sparkles],
              ['Clean Checkout', ArrowRight],
            ].map(([label, Icon]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                <Icon className="text-teal-600" size={28} />
                <div className="mt-8 text-lg font-bold">{label}</div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 w-2/3 rounded-full bg-teal-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
