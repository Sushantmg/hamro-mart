import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
      <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRightIcon className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
          {item.href ? (
            <Link href={item.href} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-200 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
