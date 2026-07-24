import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../../components/common/EmptyState.jsx';
import { clearCart, loadCart, removeCartItem, updateCartItem } from '../../redux/slices/cartSlice.js';
import { paymentService } from '../../services/paymentService.js';
import { formatMoney } from '../../utils/formatters.js';

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart, status } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) {
      return;
    }
    try {
      await dispatch(updateCartItem({ itemId: item.id, quantity })).unwrap();
    } catch (error) {
      toast.error(error || 'Could not update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await dispatch(removeCartItem(itemId)).unwrap();
      toast.success('Removed from cart');
    } catch (error) {
      toast.error(error || 'Could not remove item');
    }
  };

  const clear = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error(error || 'Could not clear cart');
    }
  };

  const checkout = async () => {
    try {
      const session = await paymentService.createSession();
      window.location.assign(session.checkoutUrl);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not start checkout');
    }
  };

  if (status === 'loading' && cart.items.length === 0) {
    return <section className="mx-auto max-w-6xl px-4 py-10"><div className="h-80 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" /></section>;
  }

  if (cart.items.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <EmptyState title="Your cart is empty" message="Add products from the catalog to build your checkout." />
        <div className="mt-6 text-center">
          <Link className="btn-primary" to="/products"><ShoppingBag size={18} /> Shop products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black">Shopping Cart</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{cart.totalItems} items ready for checkout.</p>
        </div>
        <button className="btn-secondary" onClick={clear}>Clear cart</button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {cart.items.map((item) => (
            <div key={item.id} className="grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto]">
              <img className="aspect-square rounded-lg object-cover" src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'} alt={item.product.title} />
              <div>
                <Link className="text-lg font-black hover:text-teal-700 dark:hover:text-teal-300" to={`/products/${item.product.id}`}>
                  {item.product.title}
                </Link>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.product.category?.name}</div>
                <div className="mt-3 font-bold">{formatMoney(item.product.price)}</div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                  <button className="p-2" onClick={() => updateQuantity(item, item.quantity - 1)} aria-label="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold">{item.quantity}</span>
                  <button className="p-2" onClick={() => updateQuantity(item, item.quantity + 1)} aria-label="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>
                <button className="btn-secondary px-3" onClick={() => removeItem(item.id)} aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black">Order Summary</h2>
          <div className="mt-5 flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-bold">{formatMoney(cart.subtotal)}</span>
          </div>
          <div className="mt-3 flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Shipping</span>
            <span>Calculated later</span>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-5 text-2xl font-black dark:border-slate-800">
            {formatMoney(cart.subtotal)}
          </div>
          <button className="btn-primary mt-6 w-full" onClick={checkout}>Continue to checkout</button>
        </aside>
      </div>
    </section>
  );
}
