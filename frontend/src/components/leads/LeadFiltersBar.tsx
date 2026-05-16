import { Search, X, SlidersHorizontal } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource } from '../../types';

interface LeadFiltersProps {
  filters: LeadFilters;
  onUpdate: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: Array<{ value: LeadStatus | ''; label: string }> = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: '🔵 New' },
  { value: 'Contacted', label: '🟡 Contacted' },
  { value: 'Qualified', label: '🟢 Qualified' },
  { value: 'Lost', label: '🔴 Lost' },
];

const SOURCE_OPTIONS: Array<{ value: LeadSource | ''; label: string }> = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: '🌐 Website' },
  { value: 'Instagram', label: '📸 Instagram' },
  { value: 'Referral', label: '🤝 Referral' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: '↓ Latest First' },
  { value: 'oldest', label: '↑ Oldest First' },
];

export default function LeadFiltersBar({ filters, onUpdate, onReset }: LeadFiltersProps) {
  const hasActiveFilters = filters.status || filters.source || filters.search || filters.sort !== 'latest';

  return (
    <div className="rounded-2xl p-4 bg-dynamic-card border-dynamic border">
      <div className="flex items-center gap-3 flex-wrap">
        <SlidersHorizontal size={14} className="text-slate-500 flex-shrink-0" />

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => onUpdate('search', e.target.value)}
            className="input pl-9 py-2.5 text-sm"
          />
          {filters.search && (
            <button onClick={() => onUpdate('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Selects */}
        <select value={filters.status}
          onChange={(e) => onUpdate('status', e.target.value as LeadStatus | '')}
          className="select py-2.5 w-44 text-sm">
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select value={filters.source}
          onChange={(e) => onUpdate('source', e.target.value as LeadSource | '')}
          className="select py-2.5 w-44 text-sm">
          {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select value={filters.sort}
          onChange={(e) => onUpdate('sort', e.target.value as 'latest' | 'oldest')}
          className="select py-2.5 w-40 text-sm">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {hasActiveFilters && (
          <button onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400
                       px-3 py-2 rounded-xl hover:bg-red-500/8 transition-all border border-transparent
                       hover:border-red-500/20 font-medium">
            <X size={12} />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
