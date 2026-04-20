import type { FormEvent } from "react";
import { CountryAutocomplete } from "./CountryAutocomplete";
import { InputField } from "./InputField";
import { useRegistrationForm } from "../hooks/useRegistrationForm";

const spinnerClassName =
  "inline-block size-4 animate-spin rounded-full border-2 border-white/35 border-t-white align-[-2px]";

export function RegistrationForm() {
  const {
    values,
    errors,
    submitState,
    isSubmitting,
    selectedCountryRule,
    filteredCountryNames,
    isCountryMenuOpen,
    setIsCountryMenuOpen,
    handleFieldChange,
    clearForm,
    submit,
  } = useRegistrationForm();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit();
  };

  const taxIdentifierHint =
    selectedCountryRule?.taxIdHint ??
    "Country-specific tax identifier format appears after choosing a country.";

  const taxIdentifierPlaceholder = selectedCountryRule?.taxIdPlaceholder ?? "Tax identifier";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-white/70 bg-white/70 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-6 py-4">
          <p className="text-2xl font-extrabold tracking-tight text-blue-700">Delasport</p>
          <p className="hidden text-sm font-medium text-slate-500 md:block">Secure Registration</p>
        </div>
      </header>

      <main className="flex w-full flex-1 items-center justify-center px-6 py-10 md:px-10 md:py-14">
        <section className="mx-auto flex w-full max-w-2xl flex-col rounded-[2rem] border border-white bg-white/90 p-10 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.45)] md:p-14">
          <div className="mx-auto mb-14 max-w-xl text-center md:mb-16">
            <h1 className="text-3xl font-extrabold leading-[1] tracking-tight text-slate-800 md:text-5xl">
              Establish Your
              <br />
              Digital Authority
            </h1>
            <p
              className="mx-auto mt-6 max-w-2xl text-slate-500"
              style={{ fontSize: "clamp(1.1rem, 1.2vw, 1.5rem)" }}
            >
              Join Delasport&apos;s high-trust platform for secure enterprise identifiers.
            </p>
          </div>

          <form
            className="mx-auto w-full max-w-xl space-y-16 md:space-y-[4.5rem]"
            onSubmit={handleSubmit}
            onReset={clearForm}
            noValidate
          >
            <InputField
              id="fullName"
              name="fullName"
              type="text"
              value={values.fullName}
              onChange={(event) => handleFieldChange("fullName", event.target.value)}
              placeholder="e.g. Alexander Hamilton"
              autoComplete="name"
              label="Full Name"
              hint="Minimum 3 characters required."
              error={errors.fullName}
            />

            <CountryAutocomplete
              value={values.country}
              error={errors.country}
              isOpen={isCountryMenuOpen}
              options={filteredCountryNames}
              onChange={handleFieldChange}
              onOpenChange={setIsCountryMenuOpen}
            />

            <div className="pb-5">
              <InputField
                id="taxIdentifier"
                name="taxIdentifier"
                type="text"
                value={values.taxIdentifier}
                onChange={(event) => handleFieldChange("taxIdentifier", event.target.value)}
                placeholder={taxIdentifierPlaceholder}
                label="Tax Identifier"
                error={errors.taxIdentifier}
              />
              <p className="mt-8 text-sm italic text-slate-500">{taxIdentifierHint}</p>
            </div>

            <div className="pt-6">
              <div className="flex items-start gap-3.5">
                <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-lg">🛡️</div>
                <div>
                  <p className="font-bold text-slate-700" style={{ fontSize: "clamp(1rem, 1.05vw, 1.25rem)" }}>
                    Military-Grade Security
                  </p>
                  <p className="mt-2 text-slate-500" style={{ fontSize: "clamp(0.9rem, 0.95vw, 1.05rem)" }}>
                    Data is encrypted using military-grade AES-256 protocols. Your identifier is never
                    stored in plain text.
                  </p>
                </div>
              </div>
            </div>

            {submitState ? (
              <p
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${submitState.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
                role="status"
              >
                {submitState.message}
              </p>
            ) : null}

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
          </form>
        </section>
      </main>
    </div>
  );
}
