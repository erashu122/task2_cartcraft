import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPage }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button className="btn-secondary px-3" disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Previous page">
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }).slice(0, 7).map((_, index) => (
        <button
          key={index}
          className={index === page ? 'btn-primary px-4' : 'btn-secondary px-4'}
          onClick={() => onPage(index)}
        >
          {index + 1}
        </button>
      ))}
      <button className="btn-secondary px-3" disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)} aria-label="Next page">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
