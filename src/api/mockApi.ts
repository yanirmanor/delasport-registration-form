import type { RegistrationValues } from "../utils/validation";

export type RegistrationResponse = {
  message: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitRegistrationMock = async (
  values: RegistrationValues,
): Promise<RegistrationResponse> => {
  await wait(900);

  if (values.fullName.toLowerCase().includes("error") || values.taxIdentifier.toUpperCase().includes("FAIL")) {
    throw new Error("Could not verify the registration data.");
  }

  return {
    message: "Registration completed successfully.",
  };
};
