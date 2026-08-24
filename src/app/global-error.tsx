"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-8 max-w-md">
            An unexpected error occurred. Please try again or go back to the homepage.
          </p>
          <div className="flex gap-3">
            <button onClick={reset} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
              Try Again
            </button>
            <button onClick={() => (window.location.href = "/")} className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
