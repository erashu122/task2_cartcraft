import { CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <section className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-12">
      <div className="glass-panel max-w-xl rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={58} />
        <h1 className="mt-5 text-4xl font-black">Payment received</h1>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
          Your checkout has completed. CartCraft will mark the order paid only after Stripe sends a verified webhook.
        </p>
        {sessionId && (
          <div className="mt-5 rounded-lg bg-slate-100 px-4 py-3 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Session: {sessionId}
          </div>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link className="btn-primary" to="/orders">View orders</Link>
          <Link className="btn-secondary" to="/products">Keep shopping</Link>
        </div>
      </div>
    </section>
  );
}
