import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingSkeleton from '../../components/common/LoadingSkeleton.jsx';
import Pagination from '../../components/catalog/Pagination.jsx';
import ProductCard from '../../components/catalog/ProductCard.jsx';
import ProductFilters from '../../components/catalog/ProductFilters.jsx';
import { catalogService } from '../../services/catalogService.js';

const initialFilters = {
  q: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
  page: 0,
  size: 12,
};

export default function ProductListPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [categories, setCategories] = useState([]);
  const [productsPage, setProductsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== ''),
  ), [filters]);

  useEffect(() => {
    catalogService.getCategories()
      .then(setCategories)
      .catch(() => toast.error('Could not load categories'));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    catalogService.getProducts(params)
      .then((data) => {
        if (active) {
          setProductsPage(data);
        }
      })
      .catch(() => toast.error('Could not load products'))
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [params]);

  const products = productsPage?.content || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black">Shop Products</h1>
          <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
            Search, filter, and compare items from the CartCraft catalog.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900">
          {productsPage?.totalElements || 0} products
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <ProductFilters
          categories={categories}
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />

        <div>
          {loading ? (
            <LoadingSkeleton />
          ) : products.length > 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                page={productsPage.number}
                totalPages={productsPage.totalPages}
                onPage={(page) => setFilters((current) => ({ ...current, page }))}
              />
            </>
          ) : (
            <EmptyState title="No products found" />
          )}
        </div>
      </div>
    </section>
  );
}
