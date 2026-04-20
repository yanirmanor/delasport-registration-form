import type { RegistrationValues } from "./validation";

export type RegistrationResponse = {
  message: string;
};

const parseResponse = async (response: Response): Promise<RegistrationResponse> => {
  const fallback = { message: "Unexpected response from server." };

  try {
    const data = (await response.json()) as Partial<RegistrationResponse>;

    return {
      message: data.message ?? fallback.message,
    };
  } catch {
    return fallback;
  }
};

export const submitRegistration = async (
  values: RegistrationValues,
): Promise<RegistrationResponse> => {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const parsed = await parseResponse(response);

  if (!response.ok) {
    throw new Error(parsed.message);
  }

  return parsed;
};
