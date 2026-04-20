import { type FormEvent, useMemo, useState } from "react";
import { COUNTRY_NAMES, getCountryRule } from "./registration/countries";
import { submitRegistration } from "./registration/api";
import {
  type FormErrors,
  type RegistrationValues,
  validateRegistration,
} from "./registration/validation";

type SubmitState = {
  type: "success" | "error";
  message: string;
} | null;

const EMPTY_VALUES: RegistrationValues = {
  fullName: "",
  country: "",
  taxIdentifier: "",
};

const textInputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

function App() {
  const [values, setValues] = useState<RegistrationValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors<RegistrationValues>>({});
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountryRule = useMemo(() => getCountryRule(values.country), [values.country]);

  const handleFieldChange = (fieldName: keyof RegistrationValues, fieldValue: string) => {
    setValues((previousValues) => ({
      ...previousValues,
      [fieldName]: fieldValue,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: undefined,
    }));

    setSubmitState(null);
  };

  const clearForm = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    setSubmitState(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await submitRegistration(values);

      setSubmitState({ type: "success", message: response.message });
      clearForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed.";

      setSubmitState({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    clearForm();
    setSubmitState(null);
  };

  const taxIdentifierHint =
    selectedCountryRule?.taxIdHint ??
    "Country-specific tax identifier format appears after choosing a country.";

  const taxIdentifierPlaceholder = selectedCountryRule?.taxIdPlaceholder ?? "Tax identifier";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-white/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <p className="font-['Manrope'] text-2xl font-extrabold tracking-tight text-blue-700">
            Delasport
          </p>
          <p className="hidden text-sm font-medium text-slate-500 md:block">Secure Registration</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl items-center px-4 py-10 md:py-16">
        <section className="w-full rounded-3xl border border-white bg-white/90 p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] md:p-10">
          <div className="mb-8">
            <h1 className="font-['Manrope'] text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Establish Your Digital Authority
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">
              Join Delasport&apos;s high-trust platform for secure enterprise identifiers.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} onReset={handleReset} noValidate>
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={values.fullName}
                onChange={(event) => handleFieldChange("fullName", event.target.value)}
                placeholder="e.g. Alexander Hamilton"
                className={textInputClassName}
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
              />
              <p className="mt-2 text-xs text-slate-500">Minimum 3 characters required.</p>
              {errors.fullName ? (
                <p className="mt-2 text-sm font-medium text-rose-600" role="alert">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                list="countries"
                value={values.country}
                onChange={(event) => handleFieldChange("country", event.target.value)}
                placeholder="Start typing your country"
                className={textInputClassName}
                autoComplete="country-name"
                aria-invalid={Boolean(errors.country)}
              />
              <datalist id="countries">
                {COUNTRY_NAMES.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
              {errors.country ? (
                <p className="mt-2 text-sm font-medium text-rose-600" role="alert">
                  {errors.country}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 md:p-6">
              <label
                htmlFor="taxIdentifier"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500"
              >
                Tax Identifier
              </label>
              <input
                id="taxIdentifier"
                name="taxIdentifier"
                type="text"
                value={values.taxIdentifier}
                onChange={(event) => handleFieldChange("taxIdentifier", event.target.value)}
                placeholder={taxIdentifierPlaceholder}
                className={textInputClassName}
                aria-invalid={Boolean(errors.taxIdentifier)}
              />
              <p className="mt-2 text-xs italic text-slate-500">{taxIdentifierHint}</p>
              {errors.taxIdentifier ? (
                <p className="mt-2 text-sm font-medium text-rose-600" role="alert">
                  {errors.taxIdentifier}
                </p>
              ) : null}
            </div>

            {submitState ? (
              <p
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${submitState.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
                role="status"
              >
                {submitState.message}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Verify & Continue"}
              </button>
              <button
                type="reset"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear form data
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
