import React from "react";

interface BreadcrumbsProps {
  items: string[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm text-zinc-600 ${className}`}
    >
      <ol className="flex list-none p-0">
        {items.map((item, index) => (
          <li key={item} className="flex items-center">
            {index > 0 && <span className="mx-2 text-zinc-400">/</span>}
            <span
              className={
                index === items.length - 1 ? "font-medium text-zinc-900" : ""
              }
            >
              {item}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
};
