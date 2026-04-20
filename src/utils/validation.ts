import { z } from "zod";

export type RegistrationValues = {
  fullName: string;
  country: string;
  taxIdentifier: string;
};

export type FormErrors = Partial<Record<keyof RegistrationValues, string>>;

export type CountryTaxRule = {
  name: string;
  taxIdPattern: RegExp;
  taxIdHint: string;
  taxIdPlaceholder: string;
};

const DEFAULT_TAX_RULE: Omit<CountryTaxRule, "name"> = {
  taxIdPattern: /^[A-Z0-9-]{6,20}$/,
  taxIdHint: "Format: 6-20 letters, digits, or hyphens",
  taxIdPlaceholder: "AB12C3-456",
};

const COUNTRY_TAX_CONFIG: Record<string, Omit<CountryTaxRule, "name">> = {
  USA: {
    taxIdPattern: /^\d{4}-[A-Z]{3}-(\d{5}|\d{7})$/,
    taxIdHint: "Format: [4 digits]-[3 letters]-[5 or 7 digits]",
    taxIdPlaceholder: "1234-ABC-12345",
  },
  Canada: {
    taxIdPattern: /^[0-9ABD]{10}-[A-Z]{2}$/,
    taxIdHint: "Format: [10 symbols: digits or A, B, D]-[2 letters]",
    taxIdPlaceholder: "12A4B6D8A0-AB",
  },
  "United Kingdom": DEFAULT_TAX_RULE,
  Germany: DEFAULT_TAX_RULE,
  France: DEFAULT_TAX_RULE,
  Spain: DEFAULT_TAX_RULE,
  Italy: DEFAULT_TAX_RULE,
  Netherlands: DEFAULT_TAX_RULE,
  Sweden: DEFAULT_TAX_RULE,
  Norway: DEFAULT_TAX_RULE,
  Australia: DEFAULT_TAX_RULE,
  Japan: DEFAULT_TAX_RULE,
};

export const COUNTRY_RULES: CountryTaxRule[] = Object.entries(COUNTRY_TAX_CONFIG).map(
  ([name, rule]) => ({
    name,
    ...rule,
  }),
);

export const COUNTRY_NAMES = COUNTRY_RULES.map((country) => country.name);

export const getCountryRule = (countryInput: string): CountryTaxRule | undefined => {
  const normalizedInput = countryInput.trim().toLowerCase();

  return COUNTRY_RULES.find((country) => country.name.toLowerCase() === normalizedInput);
};

const buildRegistrationSchema = (countryInput: string) => {
  const selectedCountry = getCountryRule(countryInput);

  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .min(3, "Full name must be at least 3 characters."),
    country: z
      .string()
      .trim()
      .min(1, "Country is required.")
      .refine((value) => Boolean(getCountryRule(value)), {
        message: "Type and choose a country from the suggestions list.",
      }),
    taxIdentifier: z
      .string()
      .trim()
      .min(1, "Tax identifier is required.")
      .refine(
        (value) => {
          if (!selectedCountry) {
            return false;
          }

          return selectedCountry.taxIdPattern.test(value.toUpperCase());
        },
        {
          message: selectedCountry
            ? `Tax identifier format is invalid for ${selectedCountry.name}.`
            : "Type and choose a valid country before validating the tax identifier.",
        },
      ),
  });
};

const parseValidationErrors = (issues: z.ZodIssue[]): FormErrors => {
  const errors: FormErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      (field === "fullName" || field === "country" || field === "taxIdentifier") &&
      !errors[field]
    ) {
      errors[field] = issue.message;
    }
  }

  return errors;
};

export const validateRegistration = (values: RegistrationValues): FormErrors => {
  const schema = buildRegistrationSchema(values.country);
  const result = schema.safeParse(values);

  if (result.success) {
    return {};
  }

  return parseValidationErrors(result.error.issues);
};

export const validateField = (
  field: keyof RegistrationValues,
  values: RegistrationValues,
): string | undefined => {
  const errors = validateRegistration(values);

  return errors[field];
};
