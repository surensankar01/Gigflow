import { LeadStatus, LeadSource } from '../../types';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: LeadStatus;
}

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; className: string; dot: string }
> = {
  New: {
    label: 'New',
    className: 'badge-new',
    dot: 'bg-blue-400',
  },
  Contacted: {
    label: 'Contacted',
    className: 'badge-contacted',
    dot: 'bg-yellow-400',
  },
  Qualified: {
    label: 'Qualified',
    className: 'badge-qualified',
    dot: 'bg-green-400',
  },
  Lost: {
    label: 'Lost',
    className: 'badge-lost',
    dot: 'bg-red-400',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={config.className}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

interface SourceBadgeProps {
  source: LeadSource;
}

const SOURCE_CONFIG: Record<LeadSource, { label: string; emoji: string }> = {
  Website: { label: 'Website', emoji: '🌐' },
  Instagram: { label: 'Instagram', emoji: '📸' },
  Referral: { label: 'Referral', emoji: '🤝' },
};

export function SourceBadge({ source }: SourceBadgeProps) {
  const config = SOURCE_CONFIG[source];
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
