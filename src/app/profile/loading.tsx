export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse mb-6" />
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3" />
      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-6" />
      <div className="flex gap-3">
        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
