import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register as registerUser } from '../../redux/slices/authSlice.js';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { role: 'CUSTOMER' },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);

  const onSubmit = async (values) => {
    try {
      const result = await dispatch(registerUser(values)).unwrap();
      toast.success(`Welcome to CartCraft, ${result.name}`);
      navigate(result.role === 'ADMIN' ? '/admin' : '/', { replace: true });
    } catch (error) {
      toast.error(error || 'Registration failed');
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-12">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-8">
        <h1 className="text-3xl font-black">Create your account</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Choose a customer or admin role for demo access.</p>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="grid gap-2 text-sm font-semibold">
            Name
            <input className="input" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Use at least 2 characters' } })} />
            {errors.name && <span className="text-sm text-rose-500">{errors.name.message}</span>}
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <input className="input" type="email" {...register('email', { required: 'Email is required' })} />
            {errors.email && <span className="text-sm text-rose-500">{errors.email.message}</span>}
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Password
            <input className="input" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} />
            {errors.password && <span className="text-sm text-rose-500">{errors.password.message}</span>}
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Role
            <select className="input" {...register('role')}>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <button className="btn-primary mt-2" disabled={status === 'loading'}>
            <UserPlus size={18} /> {status === 'loading' ? 'Creating...' : 'Create account'}
          </button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already registered? <Link className="font-semibold text-teal-600" to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
