import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useRequireAuthAction } from '../../hooks/useRequireAuthAction.js';
import { addToCart } from '../../redux/slices/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice.js';
import { formatMoney } from '../../utils/formatters.js';
import StarRating from './StarRating.jsx';

const fallbackImage = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const image = product.images?.[0] || fallbackImage;
  const requireAuthAction = useRequireAuthAction();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const inWishlist = wishlistItems.some((item) => item.product.id === product.id);

  const addCart = () => requireAuthAction(async () => {
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error || 'Could not add to cart');
    }
  });

  const toggleWishlist = () => requireAuthAction(async () => {
    try {
      if (inWishlist) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error || 'Could not update wishlist');
    }
  });

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
            <button className="btn-secondary px-3" onClick={toggleWishlist} aria-label="Add to wishlist">
              <Heart size={18} className={inWishlist ? 'fill-rose-500 text-rose-500' : ''} />
            </button>
            <button className="btn-primary px-3" onClick={addCart} aria-label="Add to cart" disabled={product.stock <= 0}>
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
