import { LucideIcon, Users, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

// ── Spinner ─────────────────────────────────────────────────────────────────
interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; }

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-9 h-9' }[size];
  return (
    <div className={clsx(
      'border-2 rounded-full animate-spin',
      'border-[#1a2035] border-t-brand-500',
      sizeClass, className
    )} />
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = Users, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}>
        <Icon size={26} className="text-slate-600" />
      </div>
      <h3 className="text-slate-200 font-semibold text-base mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs mb-5 leading-relaxed">{description}</p>}
      {action}
    </div>
  );
}

// ── Loading Table Skeleton ───────────────────────────────────────────────────
interface LoadingTableProps { rows?: number; cols?: number; }

export function LoadingTable({ rows = 6, cols = 6 }: LoadingTableProps) {
  return (
    <div className="space-y-0">
      {/* Header skeleton */}
      <div className="flex gap-4 px-6 py-4" style={{ borderBottom: '1px solid #1a2035' }}>
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="skeleton h-3 flex-1 rounded" style={{ animationDelay: `${j * 60}ms` }} />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4"
          style={{ borderBottom: i < rows - 1 ? '1px solid #1a2035' : 'none', animationDelay: `${i * 80}ms` }}>
          <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
          {Array.from({ length: cols - 1 }).map((_, j) => (
            <div key={j} className="skeleton h-3.5 flex-1 rounded"
              style={{ animationDelay: `${(i * cols + j) * 40}ms`, maxWidth: j === 0 ? '140px' : undefined }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Error State ──────────────────────────────────────────────────────────────
interface ErrorStateProps { message: string; onRetry?: () => void; }

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertTriangle size={26} className="text-red-400" />
      </div>
      <h3 className="text-slate-200 font-semibold text-base mb-2">Something went wrong</h3>
      <p className="text-slate-500 text-sm max-w-xs mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm">
          Try again
        </button>
      )}
    </div>
  );
}
