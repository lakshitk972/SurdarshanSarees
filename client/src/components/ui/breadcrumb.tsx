import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={`text-sm ${
                  index === items.length - 1
                    ? "text-maroon font-medium"
                    : "text-gray-600 hover:text-maroon"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-maroon font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
