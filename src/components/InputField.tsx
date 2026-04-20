import type { InputHTMLAttributes } from "react";

type InputFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const textInputClassName =
  "w-full rounded-2xl border border-slate-200/80 bg-slate-100 px-6 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200";

export function InputField({ id, label, error, hint, className = "", ...props }: InputFieldProps) {
  return (
    <div className="space-y-5">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </label>
      <input
        id={id}
        className={`${textInputClassName} ${className}`.trim()}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
