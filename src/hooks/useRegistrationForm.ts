import { useMemo, useState } from "react";
import type { RegistrationResponse } from "../api/mockApi";
import { submitRegistrationMock } from "../api/mockApi";
import {
  type FormErrors,
  type RegistrationValues,
  COUNTRY_NAMES,
  getCountryRule,
  validateField,
  validateRegistration,
} from "../utils/validation";

export type SubmitState = {
  type: "success" | "error";
  message: string;
} | null;

type UseRegistrationFormOptions = {
  submitRegistration?: (values: RegistrationValues) => Promise<RegistrationResponse>;
};

const EMPTY_VALUES: RegistrationValues = {
  fullName: "",
  country: "",
  taxIdentifier: "",
};

export const useRegistrationForm = (
  options: UseRegistrationFormOptions = {},
) => {
  const submitRegistration = options.submitRegistration ?? submitRegistrationMock;

  const [values, setValues] = useState<RegistrationValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);

  const selectedCountryRule = useMemo(() => getCountryRule(values.country), [values.country]);

  const filteredCountryNames = useMemo(() => {
    const query = values.country.trim().toLowerCase();

    if (!query) {
      return COUNTRY_NAMES;
    }

    return COUNTRY_NAMES.filter((country) => country.toLowerCase().includes(query)).slice(0, 12);
  }, [values.country]);

  const clearForm = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
  };

  const handleFieldChange = (fieldName: keyof RegistrationValues, fieldValue: string) => {
    const nextValues = {
      ...values,
      [fieldName]: fieldValue,
    };

    setValues(nextValues);
    setSubmitState(null);

    if (fieldName === "country") {
      setErrors((previousErrors) => ({
        ...previousErrors,
        country: undefined,
        taxIdentifier: validateField("taxIdentifier", nextValues),
      }));

      return;
    }

    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: undefined,
    }));
  };

  const submit = async () => {
    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    setSubmitState(null);

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    try {
      setIsSubmitting(true);

      const response = await submitRegistration(values);

      setSubmitState({ type: "success", message: response.message });
      clearForm();

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed.";

      setSubmitState({ type: "error", message });

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
