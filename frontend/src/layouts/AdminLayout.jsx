import { BarChart3, Boxes, PackagePlus, ShoppingCart, UsersRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-slate-900 p-5 lg:block">
        <div className="text-xl font-black">CartCraft Admin</div>
        <nav className="mt-8 grid gap-2">
          <NavLink className="btn-secondary justify-start border-white/10 bg-white/5 text-slate-100" to="/admin">
            <BarChart3 size={18} /> Dashboard
          </NavLink>
          <NavLink className="btn-secondary justify-start border-white/10 bg-white/5 text-slate-100" to="/admin/products">
            <Boxes size={18} /> Products
          </NavLink>
          <NavLink className="btn-secondary justify-start border-white/10 bg-white/5 text-slate-100" to="/admin/orders">
            <ShoppingCart size={18} /> Orders
          </NavLink>
          <NavLink className="btn-secondary justify-start border-white/10 bg-white/5 text-slate-100" to="/admin/customers">
            <UsersRound size={18} /> Customers
          </NavLink>
          <NavLink className="btn-secondary justify-start border-white/10 bg-white/5 text-slate-100" to="/admin/inventory">
            <PackagePlus size={18} /> Inventory
          </NavLink>
        </nav>
      </aside>
      <main className="lg:pl-64">
        <Outlet />
      </main>
    </div>
  );
}
