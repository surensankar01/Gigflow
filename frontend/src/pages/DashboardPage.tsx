import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Target, XCircle, ArrowRight, Phone, Sparkles } from 'lucide-react';
import { leadService } from '../services/leadService';
import { LeadStats } from '../types';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/ui/States';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  gradient: string;
  glow: string;
  delay?: string;
}

function StatCard({ icon: Icon, label, value, gradient, glow, delay = '0ms' }: StatCardProps) {
  return (
    <div className="relative rounded-2xl p-5 animate-slide-up overflow-hidden group cursor-default bg-dynamic-card border-dynamic border"
      style={{ animationDelay: delay, boxShadow: glow }}>
      {/* subtle gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: gradient }} />
      
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: gradient, boxShadow: glow }}>
          <Icon size={18} className="text-brand-600 dark:text-white" />
        </div>
        <div className="text-3xl font-display font-bold text-dynamic mb-1 tabular-nums">
          {value.toLocaleString()}
        </div>
        <div className="text-xs text-dynamic-muted font-medium uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void leadService.getStats().then((res) => {
      if (res.success && res.data) setStats(res.data);
      setIsLoading(false);
    });
  }, []);

  const statCards: StatCardProps[] = [
    {
      icon: Users,
      label: 'Total Leads',
      value: stats?.total ?? 0,
      gradient: 'linear-gradient(135deg, rgba(100,116,139,0.2), rgba(100,116,139,0.05))',
      glow: '0 0 30px rgba(100,116,139,0.08)',
    },
    {
      icon: TrendingUp,
      label: 'New Leads',
      value: stats?.byStatus?.New ?? 0,
      gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))',
      glow: '0 0 30px rgba(59,130,246,0.1)',
    },
    {
      icon: Phone,
      label: 'Contacted',
      value: stats?.byStatus?.Contacted ?? 0,
      gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
      glow: '0 0 30px rgba(245,158,11,0.08)',
    },
    {
      icon: Target,
      label: 'Qualified',
      value: stats?.byStatus?.Qualified ?? 0,
      gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
      glow: '0 0 30px rgba(34,197,94,0.1)',
    },
    {
      icon: XCircle,
      label: 'Lost',
      value: stats?.byStatus?.Lost ?? 0,
      gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
      glow: '0 0 30px rgba(239,68,68,0.08)',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-brand-500" />
            <span className="text-brand-500 text-xs font-semibold uppercase tracking-widest">Overview</span>
          </div>
          <h1 className="font-display font-bold text-dynamic text-3xl">
            Good {getGreeting()},{' '}
            <span style={{ background: 'linear-gradient(90deg, #22c55e, #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {user?.name?.split(' ')[0]}
            </span>
          </h1>
          <p className="text-dynamic-muted text-sm mt-1">Here's your pipeline at a glance.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="text-dynamic-muted text-sm mt-3">Loading stats...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {statCards.map((card, i) => (
              <StatCard key={card.label} {...card} delay={`${i * 70}ms`} />
            ))}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Source breakdown */}
            <div className="rounded-2xl p-6 animate-slide-up bg-dynamic-card border-dynamic border" style={{ animationDelay: '350ms' }}>
              <h2 className="font-display font-semibold text-dynamic mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
                Leads by Source
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'Website', label: 'Website', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
                  { key: 'Instagram', label: 'Instagram', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
                  { key: 'Referral', label: 'Referral', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
                ].map(({ key, label, color, bg }) => {
                  const count = stats?.bySource?.[key as keyof typeof stats.bySource] ?? 0;
                  const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-dynamic font-medium">{label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-dynamic-muted">{pct}%</span>
                          <span className="text-sm font-bold" style={{ color }}>{count}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden bg-surface-border">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${bg.replace('0.15', '0.6')})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl p-6 animate-slide-up bg-dynamic-card border-dynamic border" style={{ animationDelay: '420ms' }}>
              <h2 className="font-display font-semibold text-dynamic mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'View All Leads', desc: 'Browse and manage your pipeline', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', to: '/leads' },
                  { label: 'Add New Lead', desc: 'Capture a new sales opportunity', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', to: '/leads' },
                ].map(({ label, desc, color, bg, to }) => (
                  <button key={label} onClick={() => navigate(to)}
                    className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group text-left bg-dynamic border-dynamic border"
                    onMouseEnter={e => (e.currentTarget.style.borderColor = color + '40')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--surface-border)')}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: bg, border: `1px solid ${color}30` }}>
                        <Users size={15} style={{ color }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-dynamic">{label}</div>
                        <div className="text-xs text-dynamic-muted">{desc}</div>
                      </div>
                    </div>
                    <ArrowRight size={15} className="text-slate-400 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-300 transition-colors group-hover:translate-x-0.5 transform duration-200" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
