import type { SelectHTMLAttributes } from 'react';

export const selectBaseClasses =
  'block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

type SelectWithChevronProps = SelectHTMLAttributes<HTMLSelectElement>;

export const SelectWithChevron = ({ className, children, ...props }: SelectWithChevronProps) => (
  <div className="relative">
    <select {...props} className={[selectBaseClasses, className].filter(Boolean).join(' ')}>
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.178l3.71-3.947a.75.75 0 111.08 1.04l-4.25 4.52a.75.75 0 01-1.08 0l-4.25-4.52a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);
