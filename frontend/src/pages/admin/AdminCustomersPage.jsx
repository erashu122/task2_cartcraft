import { UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService.js';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getCustomers()
      .then(setCustomers)
      .catch(() => toast.error('Could not load customers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <UsersRound className="text-teal-300" size={28} />
        <h1 className="text-3xl font-black">Customers</h1>
      </div>
      <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-[1fr_1.4fr_120px_160px] gap-4 border-b border-white/10 px-5 py-4 text-sm font-black text-slate-300">
          <span>Name</span>
          <span>Email</span>
          <span>Orders</span>
          <span>Joined</span>
        </div>
        {loading ? (
          <div className="p-8 text-slate-400">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-slate-400">No customers yet.</div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="grid grid-cols-[1fr_1.4fr_120px_160px] gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0">
              <span className="font-bold">{customer.name}</span>
              <span className="text-slate-300">{customer.email}</span>
              <span>{customer.orderCount}</span>
              <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
