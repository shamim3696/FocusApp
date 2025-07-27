import { jsx as _jsx } from "react/jsx-runtime";
export function Input({ className = '', ...props }) {
    const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200';
    return _jsx("input", { className: `${baseClasses} ${className}`, ...props });
}
