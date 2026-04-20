import { getCountryRule } from "./countries";

export type RegistrationValues = {
  fullName: string;
  country: string;
  taxIdentifier: string;
};

export type FormErrors<T extends Record<string, string>> = Partial<Record<keyof T, string>>;

type Validator<T extends Record<string, string>> = (value: string, values: T) => string | null;

const required =
  <T extends Record<string, string>>(message: string): Validator<T> =>
  (value) =>
    value.trim().length > 0 ? null : message;

const minLength =
  <T extends Record<string, string>>(minimum: number, message: string): Validator<T> =>
  (value) =>
    value.trim().length >= minimum ? null : message;

const countryExists =
  <T extends Record<string, string>>(message: string): Validator<T> =>
  (value) =>
    getCountryRule(value) ? null : message;

const taxIdentifierByCountry =
  (messageFactory: (country: string) => string): Validator<RegistrationValues> =>
  (value, values) => {
    const country = getCountryRule(values.country);

    if (!country) {
      return "Select a valid country before validating the tax identifier.";
    }

    const isValid = country.taxIdPattern.test(value.trim().toUpperCase());

    return isValid ? null : messageFactory(country.name);
  };

const runValidators = <T extends Record<string, string>>(
  value: string,
  values: T,
  validators: Validator<T>[],
): string | null => {
  for (const validator of validators) {
    const error = validator(value, values);

    if (error) {
      return error;
    }
  }

  return null;
};

type ValidationSchema<T extends Record<string, string>> = {
  [K in keyof T]: Validator<T>[];
};

const registrationSchema: ValidationSchema<RegistrationValues> = {
  fullName: [
    required("Full name is required."),
    minLength(3, "Full name must be at least 3 characters."),
  ],
  country: [
    required("Country is required."),
    countryExists("Choose a country from the suggestions list."),
  ],
  taxIdentifier: [
    required("Tax identifier is required."),
    taxIdentifierByCountry((country) => `Tax identifier format is invalid for ${country}.`),
  ],
};

export const validateRegistration = (
  values: RegistrationValues,
): FormErrors<RegistrationValues> => {
  const errors: FormErrors<RegistrationValues> = {};

  (Object.keys(registrationSchema) as (keyof RegistrationValues)[]).forEach((fieldName) => {
    const fieldValue = values[fieldName];
    const fieldError = runValidators(fieldValue, values, registrationSchema[fieldName]);

    if (fieldError) {
      errors[fieldName] = fieldError;
    }
  });

  return errors;
};
