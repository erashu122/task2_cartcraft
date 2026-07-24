import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-teal-300">404</p>
        <h1 className="mt-3 text-5xl font-black">Page not found</h1>
        <Link className="btn-primary mt-8" to="/">Return home</Link>
      </div>
    </main>
  );
}
