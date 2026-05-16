import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit, hasNext, hasPrev } = meta;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page numbers
  const pages: Array<number | '...'> = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border">
      <span className="text-xs text-slate-500">
        Showing{' '}
        <span className="text-slate-300">
          {start}–{end}
        </span>{' '}
        of <span className="text-slate-300">{total}</span> leads
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
                     hover:text-slate-200 hover:bg-surface-hover disabled:opacity-40
                     disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-600 text-sm">
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                p === page
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
                     hover:text-slate-200 hover:bg-surface-hover disabled:opacity-40
                     disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
