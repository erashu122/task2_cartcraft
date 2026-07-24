import { Heart, ShoppingCart, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../../components/common/EmptyState.jsx';
import ReviewSection from '../../components/catalog/ReviewSection.jsx';
import StarRating from '../../components/catalog/StarRating.jsx';
import { useRequireAuthAction } from '../../hooks/useRequireAuthAction.js';
import { addToCart } from '../../redux/slices/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice.js';
import { catalogService } from '../../services/catalogService.js';
import { formatMoney } from '../../utils/formatters.js';

const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const requireAuthAction = useRequireAuthAction();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = () => {
    catalogService.getProduct(id)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.images?.[0] || fallbackImage);
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="h-96 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" /></section>;
  }

  if (!product) {
    return <section className="mx-auto max-w-5xl px-4 py-10"><EmptyState title="Product not found" message="This item may have been removed." /></section>;
  }

  const images = product.images?.length ? product.images : [fallbackImage];
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
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link className="text-sm font-bold text-teal-700 dark:text-teal-300" to="/products">Back to products</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <img className="aspect-[4/3] w-full object-cover" src={selectedImage} alt={product.title} />
          </div>
          <div className="mt-4 flex gap-3 overflow-auto">
            {images.map((image) => (
              <button
                key={image}
                className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                onClick={() => setSelectedImage(image)}
              >
                <img className="h-full w-full object-cover" src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-wide text-teal-600 dark:text-teal-300">{product.category?.name}</div>
          <h1 className="mt-3 text-4xl font-black leading-tight">{product.title}</h1>
          <div className="mt-4"><StarRating rating={product.rating} count={product.reviewCount} /></div>
          <div className="mt-6 text-4xl font-black">{formatMoney(product.price)}</div>
          <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">{product.description}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button className="btn-primary" onClick={addCart} disabled={product.stock <= 0}>
              <ShoppingCart size={18} /> Add to cart
            </button>
            <button className="btn-secondary" onClick={toggleWishlist}>
              <Heart size={18} className={inWishlist ? 'fill-rose-500 text-rose-500' : ''} /> Wishlist
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 font-bold">
              <Truck className="text-teal-600" size={22} />
              {product.stock > 0 ? `${product.stock} items available` : 'Out of stock'}
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Inventory is tracked server-side before checkout to prevent overselling in later modules.
            </p>
          </div>
        </div>
      </div>
      <ReviewSection productId={product.id} onReviewSaved={loadProduct} />
    </section>
  );
}
