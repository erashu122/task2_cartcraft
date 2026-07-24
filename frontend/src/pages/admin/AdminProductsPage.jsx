import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { catalogService } from '../../services/catalogService.js';
import { formatMoney } from '../../utils/formatters.js';

export default function AdminProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoryData, productData] = await Promise.all([
        catalogService.getCategories(),
        catalogService.getProducts({ size: 48, sort: 'newest' }),
      ]);
      setCategories(categoryData);
      setProducts(productData.content || []);
    } catch {
      toast.error('Could not load product admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onCreateCategory = async (event) => {
    event.preventDefault();
    const name = event.currentTarget.categoryName.value;
    if (!name.trim()) {
      return;
    }
    try {
      await catalogService.createCategory({ name });
      event.currentTarget.reset();
      toast.success('Category created');
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Category create failed');
    }
  };

  const onCreateProduct = async (values) => {
    try {
      await catalogService.createProduct({
        title: values.title,
        description: values.description,
        price: Number(values.price),
        stock: Number(values.stock),
        categoryId: Number(values.categoryId),
        images: values.images?.split('\n').map((image) => image.trim()).filter(Boolean) || [],
      });
      reset();
      toast.success('Product created');
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Product create failed');
    }
  };

  const onDelete = async (id) => {
    try {
      await catalogService.deleteProduct(id);
      toast.success('Product deleted');
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch {
      toast.error('Product delete failed');
    }
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-black">Manage Products</h1>
          <p className="mt-2 text-slate-400">Create categories and products for the public catalog.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="grid gap-6">
          <form className="rounded-xl border border-white/10 bg-white/5 p-5" onSubmit={onCreateCategory}>
            <h2 className="font-black">New Category</h2>
            <div className="mt-4 flex gap-3">
              <input className="input" name="categoryName" placeholder="Accessories" />
              <button className="btn-primary px-3" aria-label="Create category"><Plus size={18} /></button>
            </div>
          </form>

          <form className="rounded-xl border border-white/10 bg-white/5 p-5" onSubmit={handleSubmit(onCreateProduct)}>
            <h2 className="font-black">New Product</h2>
            <div className="mt-4 grid gap-4">
              <input className="input" placeholder="Product title" {...register('title', { required: 'Title is required' })} />
              {errors.title && <span className="text-sm text-rose-400">{errors.title.message}</span>}
              <textarea className="input min-h-28" placeholder="Product description" {...register('description', { required: 'Description is required' })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="input" type="number" step="0.01" placeholder="Price" {...register('price', { required: true })} />
                <input className="input" type="number" placeholder="Stock" {...register('stock', { required: true })} />
              </div>
              <select className="input" {...register('categoryId', { required: true })}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <textarea className="input min-h-24" placeholder="Image URLs, one per line" {...register('images')} />
              <button className="btn-primary" disabled={loading}>
                <Plus size={18} /> Create product
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-5 py-4 font-black">Catalog Items</div>
          <div className="divide-y divide-white/10">
            {products.map((product) => (
              <div key={product.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="font-bold">{product.title}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {product.category?.name} / {formatMoney(product.price)} / {product.stock} stock
                  </div>
                </div>
                <button className="btn-secondary px-3" onClick={() => onDelete(product.id)} aria-label="Delete product">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {products.length === 0 && (
              <div className="p-8 text-center text-slate-400">No products yet.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
