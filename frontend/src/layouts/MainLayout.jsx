import { Link, NavLink, Outlet } from 'react-router-dom';
import { Heart, LogOut, Moon, ShoppingBag, ShoppingCart, Sun, UserRound } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../redux/slices/authSlice.js';
import { loadCart, resetCart } from '../redux/slices/cartSlice.js';
import { toggleDarkMode } from '../redux/slices/uiSlice.js';
import { loadWishlist, resetWishlist } from '../redux/slices/wishlistSlice.js';
import { useEffect } from 'react';

export default function MainLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.cart.totalItems);
  const darkMode = useSelector((state) => state.ui.darkMode);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      dispatch(loadCart());
      dispatch(loadWishlist());
    } else {
      dispatch(resetCart());
      dispatch(resetWishlist());
    }
  }, [dispatch, user]);

  const logout = () => {
    dispatch(clearCredentials());
    dispatch(resetCart());
    dispatch(resetWishlist());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-600 text-white">
              <ShoppingBag size={20} />
            </span>
            CartCraft
          </Link>

          <div className="flex items-center gap-2">
            <NavLink className="hidden text-sm font-bold text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300 sm:inline-flex" to="/products">
              Products
            </NavLink>
            <button className="btn-secondary px-3" onClick={() => dispatch(toggleDarkMode())} aria-label="Toggle dark mode">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <NavLink className="btn-secondary" to="/admin">Admin</NavLink>
                )}
                <NavIconLink count={wishlistCount} label="Wishlist" to="/wishlist">
                  <Heart size={18} />
                </NavIconLink>
                <NavIconLink count={cartCount} label="Cart" to="/cart">
                  <ShoppingCart size={18} />
                </NavIconLink>
                <NavLink className="btn-secondary px-3" to="/profile" aria-label="Profile">
                  <UserRound size={18} />
                </NavLink>
                <button className="btn-secondary px-3" onClick={logout} aria-label="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn-secondary" to="/login">Login</NavLink>
                <NavLink className="btn-primary py-2.5" to="/register">Join</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function NavIconLink({ children, count, label, to }) {
  return (
    <NavLink className="btn-secondary relative px-3" to={to} aria-label={label}>
      {children}
      {count > 0 && (
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-teal-600 px-1 text-[11px] font-black text-white">
          {count}
        </span>
      )}
    </NavLink>
  );
}
