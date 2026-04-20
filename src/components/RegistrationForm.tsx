import type { FormEvent } from "react";
import { CountryAutocomplete } from "./CountryAutocomplete";
import { InputField } from "./InputField";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { defaultTaxIdentifierHint, taxIdentifierFallbackPlaceholder } from "./RegistrationForm.styles";
import { RegistrationFormActions } from "./RegistrationFormActions";
import { RegistrationHeader } from "./RegistrationHeader";
import { RegistrationHero } from "./RegistrationHero";
import { SecurityNotice } from "./SecurityNotice";
import { SubmissionFeedback } from "./SubmissionFeedback";
import { TaxIdentifierField } from "./TaxIdentifierField";

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

  const taxIdentifierHint = selectedCountryRule?.taxIdHint ?? defaultTaxIdentifierHint;

  const taxIdentifierPlaceholder = selectedCountryRule?.taxIdPlaceholder ?? taxIdentifierFallbackPlaceholder;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-slate-800">
      <RegistrationHeader />

      <main className="flex w-full flex-1 items-center justify-center px-6 py-10 md:px-10 md:py-14">
        <section className="mx-auto flex w-full max-w-2xl flex-col rounded-[2rem] border border-white bg-white/90 p-10 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.45)] md:p-14">
          <RegistrationHero />

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

            <TaxIdentifierField
              value={values.taxIdentifier}
              onChange={(value) => handleFieldChange("taxIdentifier", value)}
              placeholder={taxIdentifierPlaceholder}
              hint={taxIdentifierHint}
              error={errors.taxIdentifier}
            />

            <SecurityNotice />

            <SubmissionFeedback submitState={submitState} />

            <RegistrationFormActions isSubmitting={isSubmitting} />
          </form>
        </section>
      </main>
    </div>
  );
}
