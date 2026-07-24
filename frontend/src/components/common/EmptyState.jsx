import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'Nothing found', message = 'Try changing your filters.' }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/70">
      <SearchX className="text-slate-400" size={42} />
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
