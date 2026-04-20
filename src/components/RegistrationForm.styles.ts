export const spinnerClassName =
  "inline-block size-4 animate-spin rounded-full border-2 border-white/35 border-t-white align-[-2px]";

export const defaultTaxIdentifierHint =
  "Country-specific tax identifier format appears after choosing a country.";

export const taxIdentifierFallbackPlaceholder = "Tax identifier";

export const submitStateClassByType = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700",
} as const;

export const headingDescriptionStyle = {
  fontSize: "clamp(1.1rem, 1.2vw, 1.5rem)",
};

export const securityTitleStyle = {
  fontSize: "clamp(1rem, 1.05vw, 1.25rem)",
};

export const securityDescriptionStyle = {
  fontSize: "clamp(0.9rem, 0.95vw, 1.05rem)",
};
