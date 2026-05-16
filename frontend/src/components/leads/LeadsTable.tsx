import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/StatusBadge';
import { LoadingTable, EmptyState } from '../ui/States';
import { useAuthStore } from '../../store/authStore';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const AVATAR_COLORS = [
  { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', text: '#4ade80' },
  { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
  { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#c084fc' },
  { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
  { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
  { bg: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.3)', text: '#f472b6' },
];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function LeadsTable({ leads, isLoading, onEdit, onView, onDelete }: LeadsTableProps) {
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (isLoading) return <LoadingTable rows={8} cols={6} />;

  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description="Try adjusting your filters or add a new lead to get started."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dynamic">
            {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((col) => (
              <th key={col}
                className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest
                           px-5 py-3.5 first:pl-6 last:pr-6">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const avatar = getAvatarColor(lead.name);
            return (
              <tr key={lead._id}
                className="group transition-colors duration-150 cursor-pointer border-b border-dynamic last:border-b-0 hover:bg-surface-hover"
                onClick={() => onView(lead)}>

                {/* Name */}
                <td className="px-5 py-3.5 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs"
                      style={{ background: avatar.bg, border: `1px solid ${avatar.border}`, color: avatar.text }}>
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {lead.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-3.5">
                  <span className="text-xs text-slate-400 font-mono">{lead.email}</span>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <StatusBadge status={lead.status} />
                </td>

                {/* Source */}
                <td className="px-5 py-3.5">
                  <SourceBadge source={lead.source} />
                </td>

                {/* Date */}
                <td className="px-5 py-3.5">
                  <span className="text-xs text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5 pr-6" onClick={e => e.stopPropagation()}>
                  <div className="relative flex justify-end">
                    <button
                      onClick={() => setMenuOpen(menuOpen === lead._id ? null : lead._id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500
                                 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-surface-border transition-all
                                 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={15} />
                    </button>

                    {menuOpen === lead._id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-full mt-1.5 z-20 rounded-xl shadow-2xl shadow-black/60 py-1.5 min-w-[148px] animate-scale-in bg-dynamic-card border border-dynamic">
                          <button onClick={() => { onView(lead); setMenuOpen(null); }}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 dark:text-slate-300
                                       hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white transition-colors">
                            <Eye size={13} className="text-slate-400" /> View Details
                          </button>
                          <button onClick={() => { onEdit(lead); setMenuOpen(null); }}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 dark:text-slate-300
                                       hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white transition-colors">
                            <Pencil size={13} className="text-blue-500 dark:text-blue-400" /> Edit Lead
                          </button>
                          {user?.role === 'admin' && (
                            <>
                              <div className="h-px mx-2 my-1 bg-surface-border" />
                              <button onClick={() => { onDelete(lead._id); setMenuOpen(null); }}
                                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-500 dark:text-red-400
                                           hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                <Trash2 size={13} /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
