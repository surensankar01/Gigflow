import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, UserPlus, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Spinner } from '../components/ui/States';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register(formData);
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-dynamic">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-brand-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="w-full max-w-[440px] relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 40px rgba(34,197,94,0.3)' }}>
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-dynamic text-3xl mb-2">Create your account</h1>
          <p className="text-dynamic-muted text-sm">Join GigFlow and start managing your leads.</p>
        </div>

        {/* Form Card */}
        <div className="card-glow p-8 bg-dynamic-card">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select border-brand-500/30 bg-brand-500/5 focus:border-brand-500"
              >
                <option value="user">Standard User</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-[10px] text-dynamic-muted mt-2 font-medium">
                {formData.role === 'admin' ? 'Admins can delete leads and access all data.' : 'Users can view, add, and edit leads.'}
              </p>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3 mt-4 text-base">
              {isLoading ? <Spinner size="sm" /> : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-dynamic-muted mt-8 text-sm font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 hover:text-brand-400 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
