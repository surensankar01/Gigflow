import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Spinner } from '../components/ui/States';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-dynamic">
      {/* Left side - Branding/Features (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'var(--sidebar-gradient)', borderRight: '1px solid var(--surface-border)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 30px rgba(34,197,94,0.3)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-dynamic text-xl tracking-tight">GigFlow</span>
          </div>

          <h1 className="font-display font-bold text-dynamic text-5xl leading-tight mb-6">
            Manage your leads.<br />
            <span style={{ background: 'linear-gradient(90deg, #22c55e, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Close more deals.
            </span>
          </h1>
          <p className="text-dynamic-muted text-lg max-w-md mb-12">
            The premium CRM dashboard designed for modern sales teams to track, engage, and convert prospects faster.
          </p>

          <div className="space-y-6">
            {[
              'Real-time pipeline analytics',
              'Advanced filtering and search',
              'Secure role-based access'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-dynamic">
                <CheckCircle2 className="text-brand-500 flex-shrink-0" size={24} />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-dynamic text-3xl mb-2">Welcome back</h2>
            <p className="text-dynamic-muted">Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-11"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              {isLoading ? <Spinner size="sm" /> : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-dynamic-muted mt-8 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-400 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
