import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/StatusBadge';
import { Calendar, Mail, FileText, User, Pencil } from 'lucide-react';

interface LeadDetailProps {
  lead: Lead;
  onEdit: () => void;
}

export default function LeadDetail({ lead, onEdit }: LeadDetailProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <span className="text-brand-400 text-lg font-semibold">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{lead.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={lead.status} />
              <SourceBadge source={lead.source} />
            </div>
          </div>
        </div>
        <button onClick={onEdit} className="btn-secondary py-1.5 text-xs">
          <Pencil size={12} />
          Edit
        </button>
      </div>

      {/* Details */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-surface-border flex items-center justify-center flex-shrink-0">
            <Mail size={13} className="text-slate-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Email</div>
            <div className="text-sm text-slate-200 font-mono">{lead.email}</div>
          </div>
        </div>

        {lead.createdBy && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-surface-border flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-slate-400" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Created By</div>
              <div className="text-sm text-slate-200">{lead.createdBy.name}</div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-surface-border flex items-center justify-center flex-shrink-0">
            <Calendar size={13} className="text-slate-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Created At</div>
            <div className="text-sm text-slate-200">
              {new Date(lead.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {lead.notes && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-surface-border flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText size={13} className="text-slate-400" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Notes</div>
              <div className="text-sm text-slate-300 leading-relaxed">
                {lead.notes}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
