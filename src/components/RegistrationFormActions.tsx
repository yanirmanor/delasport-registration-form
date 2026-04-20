import { spinnerClassName } from "./RegistrationForm.styles";

type RegistrationFormActionsProps = {
  isSubmitting: boolean;
};

export function RegistrationFormActions({ isSubmitting }: RegistrationFormActionsProps) {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 text-lg font-semibold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className={spinnerClassName} aria-hidden="true" />
            Submitting...
          </span>
        ) : (
          "Verify & Continue →"
        )}
      </button>
      <button
        type="reset"
        className="cursor-pointer px-6 py-1 text-lg font-medium text-slate-600 transition hover:text-slate-800"
      >
        Clear form data
      </button>
    </div>
  );
}
