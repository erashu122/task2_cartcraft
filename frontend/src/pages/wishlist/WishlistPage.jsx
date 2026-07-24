import { ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../../components/common/EmptyState.jsx';
import { addToCart } from '../../redux/slices/cartSlice.js';
import { loadWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice.js';
import { formatMoney } from '../../utils/formatters.js';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  const moveToCart = async (productId) => {
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('Moved to cart');
    } catch (error) {
      toast.error(error || 'Could not move item');
    }
  };

  const remove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error || 'Could not remove item');
    }
  };

  if (status === 'loading' && items.length === 0) {
    return <section className="mx-auto max-w-6xl px-4 py-10"><div className="h-80 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" /></section>;
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <EmptyState title="Wishlist is empty" message="Save products you love and revisit them here." />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Wishlist</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ product }) => (
          <article key={product.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <Link to={`/products/${product.id}`}>
              <img className="aspect-[4/3] w-full object-cover" src={product.images?.[0] || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80'} alt={product.title} />
            </Link>
            <div className="p-4">
              <Link className="text-lg font-black hover:text-teal-700 dark:hover:text-teal-300" to={`/products/${product.id}`}>{product.title}</Link>
              <div className="mt-2 font-bold">{formatMoney(product.price)}</div>
              <div className="mt-4 flex gap-2">
                <button className="btn-primary flex-1" onClick={() => moveToCart(product.id)} disabled={product.stock <= 0}>
                  <ShoppingCart size={18} /> Cart
                </button>
                <button className="btn-secondary px-3" onClick={() => remove(product.id)} aria-label="Remove from wishlist">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
