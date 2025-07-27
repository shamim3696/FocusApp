import { jsx as _jsx } from "react/jsx-runtime";
export function Card({ className = '', children, ...props }) {
    const baseClasses = 'rounded-lg border border-gray-200 bg-white shadow-sm';
    return (_jsx("div", { className: `${baseClasses} ${className}`, ...props, children: children }));
}
