import {
  getCountryRule,
  validateField,
  validateRegistration,
  type RegistrationValues,
} from "../utils/validation";

const baseValues: RegistrationValues = {
  fullName: "Alice Cooper",
  country: "USA",
  taxIdentifier: "1234-ABC-12345",
};

describe("validation utilities", () => {
  it("matches country rules case-insensitively and with trim", () => {
    const usa = getCountryRule(" usa ");

    expect(usa?.name).toBe("USA");
  });

  it("returns required errors for all empty fields", () => {
    const errors = validateRegistration({
      fullName: "",
      country: "",
      taxIdentifier: "",
    });

    expect(errors.fullName).toMatch(/required/i);
    expect(errors.country).toMatch(/required/i);
    expect(errors.taxIdentifier).toMatch(/required/i);
  });

  it("validates full name minimum length", () => {
    const errors = validateRegistration({
      ...baseValues,
      fullName: "Al",
    });

    expect(errors.fullName).toMatch(/at least 3 characters/i);
  });

  it("rejects unknown country", () => {
    const errors = validateRegistration({
      ...baseValues,
      country: "Atlantis",
    });

    expect(errors.country).toMatch(/suggestions list/i);
  });

  it("validates USA and Canada tax identifier formats", () => {
    const usaValid = validateRegistration({
      ...baseValues,
      country: "USA",
      taxIdentifier: "1234-ABC-12345",
    });
    expect(usaValid.taxIdentifier).toBeUndefined();

    const usaInvalid = validateRegistration({
      ...baseValues,
      country: "USA",
      taxIdentifier: "12A4B6D8A0-AB",
    });
    expect(usaInvalid.taxIdentifier).toMatch(/invalid for usa/i);

    const canadaValid = validateRegistration({
      ...baseValues,
      country: "Canada",
      taxIdentifier: "12A4B6D8A0-AB",
    });
    expect(canadaValid.taxIdentifier).toBeUndefined();

    const canadaInvalid = validateRegistration({
      ...baseValues,
      country: "Canada",
      taxIdentifier: "1234-ABC-12345",
    });
    expect(canadaInvalid.taxIdentifier).toMatch(/invalid for canada/i);
  });

  it("validateField returns only requested field error", () => {
    const values: RegistrationValues = {
      fullName: "Al",
      country: "USA",
      taxIdentifier: "bad",
    };

    expect(validateField("fullName", values)).toMatch(/at least 3 characters/i);
    expect(validateField("taxIdentifier", values)).toMatch(/invalid for usa/i);
    expect(validateField("country", values)).toBeUndefined();
  });
});
