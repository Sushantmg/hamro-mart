import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-200 dark:bg-emerald-800 rounded-full blur-2xl opacity-30" />
        <div className="relative text-[120px] leading-none font-extrabold text-emerald-600 dark:text-emerald-400">
          404
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-2 max-w-md">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
        Try checking the URL or head back to our homepage.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/products" className="btn-secondary">Browse Products</Link>
      </div>
    </div>
  );
}
