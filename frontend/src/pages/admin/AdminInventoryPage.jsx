import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService.js';
import { formatMoney } from '../../utils/formatters.js';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getLowStockProducts()
      .then(setProducts)
      .catch(() => toast.error('Could not load low stock products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-rose-300" size={28} />
        <h1 className="text-3xl font-black">Inventory Alerts</h1>
      </div>
      <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-[1fr_160px_120px_140px] gap-4 border-b border-white/10 px-5 py-4 text-sm font-black text-slate-300">
          <span>Product</span>
          <span>Category</span>
          <span>Stock</span>
          <span>Price</span>
        </div>
        {loading ? (
          <div className="p-8 text-slate-400">Loading inventory...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-slate-400">No low-stock products.</div>
        ) : (
          products.map((product) => (
            <div key={product.productId} className="grid grid-cols-[1fr_160px_120px_140px] gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0">
              <Link className="font-bold hover:text-teal-300" to={`/products/${product.productId}`}>{product.title}</Link>
              <span className="text-slate-300">{product.categoryName}</span>
              <span className="font-black text-rose-300">{product.stock}</span>
              <span>{formatMoney(product.price)}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
