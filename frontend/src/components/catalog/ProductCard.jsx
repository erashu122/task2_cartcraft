import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils/formatters.js';
import StarRating from './StarRating.jsx';

const fallbackImage = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80';

export default function ProductCard({ product }) {
  const image = product.images?.[0] || fallbackImage;

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={image} alt={product.title} />
        </div>
      </Link>
      <div className="p-4">
        <div className="text-xs font-bold uppercase tracking-wide text-teal-600 dark:text-teal-300">
          {product.category?.name}
        </div>
        <Link to={`/products/${product.id}`} className="mt-2 line-clamp-2 min-h-12 text-lg font-black hover:text-teal-700 dark:hover:text-teal-300">
          {product.title}
        </Link>
        <div className="mt-3">
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-black">{formatMoney(product.price)}</div>
            <div className={product.stock > 0 ? 'text-xs text-emerald-600' : 'text-xs text-rose-500'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary px-3" aria-label="Add to wishlist">
              <Heart size={18} />
            </button>
            <button className="btn-primary px-3" aria-label="Add to cart" disabled={product.stock <= 0}>
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
