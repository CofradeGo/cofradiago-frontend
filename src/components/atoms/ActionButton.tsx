import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const ActionButton = ({ label, ...props }: Props) => (
  <button
    {...props}
    className="
      px-3 py-1.5
      rounded-md
      bg-blue-600
      text-white text-sm font-medium
      shadow-sm
      hover:bg-blue-700
      active:scale-95
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
      transition duration-150
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  >
    {label}
  </button>
);
