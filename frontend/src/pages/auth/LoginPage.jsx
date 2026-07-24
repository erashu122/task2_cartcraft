import { useForm } from 'react-hook-form';
import { LockKeyhole } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../../redux/slices/authSlice.js';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector((state) => state.auth.status);

  const onSubmit = async (values) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      toast.success(`Welcome back, ${result.name}`);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (error) {
      toast.error(error || 'Login failed');
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Access your CartCraft account">
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input className="input" type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <span className="text-sm text-rose-500">{errors.email.message}</span>}
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Password
          <input className="input" type="password" {...register('password', { required: 'Password is required' })} />
          {errors.password && <span className="text-sm text-rose-500">{errors.password.message}</span>}
        </label>
        <button className="btn-primary mt-2" disabled={status === 'loading'}>
          <LockKeyhole size={18} /> {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New here? <Link className="font-semibold text-teal-600" to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <section className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-12">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
