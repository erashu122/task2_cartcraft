import { RotateCcw, Search } from 'lucide-react';

export default function ProductFilters({ categories, filters, onChange, onReset }) {
  const update = (key, value) => onChange({ ...filters, [key]: value, page: 0 });

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="font-black">Filters</h2>
        <button className="btn-secondary px-3 py-2" onClick={onReset} aria-label="Reset filters">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">
          Search
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              className="input pl-10"
              value={filters.q}
              onChange={(event) => update('q', event.target.value)}
              placeholder="Search products"
            />
          </div>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Category
          <select className="input" value={filters.categoryId} onChange={(event) => update('categoryId', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2 text-sm font-semibold">
            Min
            <input className="input" type="number" min="0" value={filters.minPrice} onChange={(event) => update('minPrice', event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Max
            <input className="input" type="number" min="0" value={filters.maxPrice} onChange={(event) => update('maxPrice', event.target.value)} />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          Sort
          <select className="input" value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
