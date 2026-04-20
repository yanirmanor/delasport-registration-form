import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";

const { submitRegistrationMock } = vi.hoisted(() => ({
  submitRegistrationMock: vi.fn(),
}));

vi.mock("../api/mockApi", () => ({
  submitRegistrationMock,
}));

const fillForm = ({
  fullName = "Alice Cooper",
  country = "USA",
  taxIdentifier = "1234-ABC-12345",
}: {
  fullName?: string;
  country?: string;
  taxIdentifier?: string;
} = {}) => {
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: fullName },
  });
  fireEvent.change(screen.getByLabelText(/country/i), {
    target: { value: country },
  });
  fireEvent.change(screen.getByLabelText(/tax identifier/i), {
    target: { value: taxIdentifier },
  });
};

describe("Registration form", () => {
  beforeEach(() => {
    submitRegistrationMock.mockReset();
  });

  it("renders all required fields and actions", () => {
    render(<App />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tax identifier/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify & continue/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear form data/i })).toBeInTheDocument();
  });

  it("shows validation errors for each required field", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/country is required/i)).toBeInTheDocument();
    expect(screen.getByText(/tax identifier is required/i)).toBeInTheDocument();
    expect(submitRegistrationMock).not.toHaveBeenCalled();
  });

  it("completes successful validation flow and submits once", async () => {
    submitRegistrationMock.mockResolvedValue({ message: "Registration completed successfully." });

    render(<App />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    await waitFor(() => expect(submitRegistrationMock).toHaveBeenCalledTimes(1));
    expect(submitRegistrationMock).toHaveBeenCalledWith({
      fullName: "Alice Cooper",
      country: "USA",
      taxIdentifier: "1234-ABC-12345",
    });

    expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/country is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tax identifier is required/i)).not.toBeInTheDocument();
  });

  it("applies country-specific tax identifier validation (USA and Canada)", async () => {
    render(<App />);

    fillForm({ country: "USA", taxIdentifier: "12A4B6D8A0-AB" });
    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(await screen.findByText(/format is invalid for usa/i)).toBeInTheDocument();
    expect(submitRegistrationMock).not.toHaveBeenCalled();

    fillForm({ country: "Canada", taxIdentifier: "12A4B6D8A0-AB" });
    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    await waitFor(() => expect(submitRegistrationMock).toHaveBeenCalledTimes(1));
  });

  it("re-validates tax identifier when country changes", async () => {
    render(<App />);

    fillForm({ country: "USA", taxIdentifier: "1234-ABC-12345" });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: "Canada" },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(await screen.findByText(/format is invalid for canada/i)).toBeInTheDocument();
    expect(submitRegistrationMock).not.toHaveBeenCalled();
  });

  it("shows loading and success state for successful submission", async () => {
    submitRegistrationMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ message: "Registration accepted." });
          }, 30);
        }),
    );

    render(<App />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();

    await waitFor(() => expect(submitRegistrationMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole("status")).toHaveTextContent(/registration accepted/i);
  });

  it("shows failed submission message and keeps user input", async () => {
    submitRegistrationMock.mockRejectedValue(new Error("Invalid registration token."));

    render(<App />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    await waitFor(() => expect(submitRegistrationMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole("status")).toHaveTextContent(/invalid registration token/i);

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Alice Cooper");
    expect(screen.getByLabelText(/country/i)).toHaveValue("USA");
    expect(screen.getByLabelText(/tax identifier/i)).toHaveValue("1234-ABC-12345");
    expect(screen.getByRole("button", { name: /verify & continue/i })).toBeEnabled();
  });

  it("clears form after successful submission and with manual clear action", async () => {
    submitRegistrationMock.mockResolvedValue({ message: "Registration completed successfully." });

    render(<App />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    await waitFor(() => expect(submitRegistrationMock).toHaveBeenCalledTimes(1));

    expect(screen.getByLabelText(/full name/i)).toHaveValue("");
    expect(screen.getByLabelText(/country/i)).toHaveValue("");
    expect(screen.getByLabelText(/tax identifier/i)).toHaveValue("");

    fillForm({ fullName: "Bob", country: "Canada", taxIdentifier: "12A4B6D8A0-AB" });
    fireEvent.click(screen.getByRole("button", { name: /clear form data/i }));

    expect(screen.getByLabelText(/full name/i)).toHaveValue("");
    expect(screen.getByLabelText(/country/i)).toHaveValue("");
    expect(screen.getByLabelText(/tax identifier/i)).toHaveValue("");
  });
});
