import { KeyRound, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../redux/slices/authSlice.js';
import { authService } from '../../services/authService.js';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);
  const profileForm = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });
  const passwordForm = useForm();

  useEffect(() => {
    profileForm.reset({ name: user?.name || '', email: user?.email || '' });
  }, [profileForm, user]);

  const saveProfile = async (values) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error || 'Could not update profile');
    }
  };

  const changePassword = async (values) => {
    try {
      await authService.changePassword(values);
      passwordForm.reset();
      toast.success('Password changed');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not change password');
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="glass-panel rounded-2xl p-8" onSubmit={profileForm.handleSubmit(saveProfile)}>
          <h1 className="text-3xl font-black">Profile</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Keep your account details fresh.</p>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">
              Name
              <input className="input" {...profileForm.register('name', { required: 'Name is required', minLength: { value: 2, message: 'Use at least 2 characters' } })} />
              {profileForm.formState.errors.name && <span className="text-sm text-rose-500">{profileForm.formState.errors.name.message}</span>}
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input className="input" type="email" {...profileForm.register('email', { required: 'Email is required' })} />
              {profileForm.formState.errors.email && <span className="text-sm text-rose-500">{profileForm.formState.errors.email.message}</span>}
            </label>
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm text-slate-500 dark:text-slate-400">Role</div>
              <div className="mt-1 font-black">{user?.role}</div>
            </div>
            <button className="btn-primary" disabled={status === 'loading'}>
              <Save size={18} /> Save profile
            </button>
          </div>
        </form>

        <form className="glass-panel rounded-2xl p-8" onSubmit={passwordForm.handleSubmit(changePassword)}>
          <h2 className="text-3xl font-black">Password</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Change your password with current-password verification.</p>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">
              Current password
              <input className="input" type="password" {...passwordForm.register('currentPassword', { required: 'Current password is required' })} />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              New password
              <input className="input" type="password" {...passwordForm.register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} />
              {passwordForm.formState.errors.newPassword && <span className="text-sm text-rose-500">{passwordForm.formState.errors.newPassword.message}</span>}
            </label>
            <button className="btn-primary">
              <KeyRound size={18} /> Change password
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
