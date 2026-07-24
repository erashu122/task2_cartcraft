import { useSelector } from 'react-redux';

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-2xl p-8">
        <h1 className="text-3xl font-black">Profile</h1>
        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <Info label="Name" value={user?.name} />
          <Info label="Email" value={user?.email} />
          <Info label="Role" value={user?.role} />
        </dl>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 font-bold">{value}</dd>
    </div>
  );
}
