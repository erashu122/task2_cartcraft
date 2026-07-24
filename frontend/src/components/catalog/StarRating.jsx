import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, count = 0 }) {
  const rounded = Math.round(Number(rating || 0));

  return (
    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={16}
          className={index < rounded ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}
        />
      ))}
      <span className="ml-1">({count})</span>
    </div>
  );
}
