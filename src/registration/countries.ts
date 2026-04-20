export type CountryRule = {
  name: string;
  taxIdPattern: RegExp;
  taxIdHint: string;
  taxIdPlaceholder: string;
};

const defaultTaxRule = {
  taxIdPattern: /^[A-Z0-9-]{6,20}$/,
  taxIdHint: "Format: 6-20 letters, digits, or hyphens",
  taxIdPlaceholder: "AB12C3-456",
};

const withDefaultRule = (name: string): CountryRule => ({
  name,
  ...defaultTaxRule,
});

export const COUNTRY_RULES: CountryRule[] = [
  {
    name: "USA",
    taxIdPattern: /^\d{4}-[A-Z]{3}-(\d{5}|\d{7})$/,
    taxIdHint: "Format: [4 digits]-[3 letters]-[5 or 7 digits]",
    taxIdPlaceholder: "1234-ABC-12345",
  },
  {
    name: "Canada",
    taxIdPattern: /^[0-9ABD]{10}-[A-Z]{2}$/,
    taxIdHint: "Format: [10 symbols: digits or A, B, D]-[2 letters]",
    taxIdPlaceholder: "12A4B6D8A0-AB",
  },
  withDefaultRule("United Kingdom"),
  withDefaultRule("Germany"),
  withDefaultRule("France"),
  withDefaultRule("Spain"),
  withDefaultRule("Italy"),
  withDefaultRule("Netherlands"),
  withDefaultRule("Sweden"),
  withDefaultRule("Norway"),
  withDefaultRule("Australia"),
  withDefaultRule("Japan"),
];

export const COUNTRY_NAMES = COUNTRY_RULES.map((country) => country.name);

export const getCountryRule = (countryInput: string): CountryRule | undefined => {
  const normalizedInput = countryInput.trim().toLowerCase();

  return COUNTRY_RULES.find((country) => country.name.toLowerCase() === normalizedInput);
};
