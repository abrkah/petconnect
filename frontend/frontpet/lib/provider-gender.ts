export const PROVIDER_GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export type ProviderGender = (typeof PROVIDER_GENDER_OPTIONS)[number]["value"];
