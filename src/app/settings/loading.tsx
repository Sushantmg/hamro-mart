export default function Loading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse mb-8" />
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
