import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

const mockFetchSuccess = (message = "Registration completed successfully.") => {
  const mock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ message }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );

  vi.stubGlobal("fetch", mock);

  return mock;
};

const mockFetchFailure = (status = 422, message = "Could not verify the registration data.") => {
  const mock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ message }), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );

  vi.stubGlobal("fetch", mock);

  return mock;
};

const fillBaseForm = () => {
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: "Alice Cooper" },
  });
  fireEvent.change(screen.getByLabelText(/country/i), {
    target: { value: "USA" },
  });
};

describe("Registration form", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders all required fields and actions", () => {
    render(<App />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tax identifier/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify & continue/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear form data/i })).toBeInTheDocument();
  });

  it("shows validation errors for required fields on submit", async () => {
    mockFetchSuccess();
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/country is required/i)).toBeInTheDocument();
    expect(screen.getByText(/tax identifier is required/i)).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("shows min length validation for full name", async () => {
    mockFetchSuccess();
    render(<App />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Al" },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: "USA" },
    });
    fireEvent.change(screen.getByLabelText(/tax identifier/i), {
      target: { value: "1234-ABC-12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(await screen.findByText(/full name must be at least 3 characters/i)).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("rejects countries that are not in the suggestions list", async () => {
    mockFetchSuccess();
    render(<App />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Alice Cooper" },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: "Atlantis" },
    });
    fireEvent.change(screen.getByLabelText(/tax identifier/i), {
      target: { value: "1234-ABC-12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(
      await screen.findByText(/choose a country from the suggestions list/i),
    ).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("validates USA tax identifier format", async () => {
    mockFetchSuccess();
    render(<App />);
    fillBaseForm();

    fireEvent.change(screen.getByLabelText(/tax identifier/i), {
      target: { value: "12-ABC-12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(await screen.findByText(/format is invalid for usa/i)).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("validates Canada tax identifier format", async () => {
    mockFetchSuccess();
    render(<App />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Alice Cooper" },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: "Canada" },
    });
    fireEvent.change(screen.getByLabelText(/tax identifier/i), {
      target: { value: "1234-AB" },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    expect(await screen.findByText(/format is invalid for canada/i)).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("submits successfully and clears fields", async () => {
    const fetchMock = mockFetchSuccess("Registration accepted.");
    render(<App />);

    fillBaseForm();
    fireEvent.change(screen.getByLabelText(/tax identifier/i), {
      target: { value: "1234-ABC-12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole("status")).toHaveTextContent(/registration accepted/i);

    expect(screen.getByLabelText(/full name/i)).toHaveValue("");
    expect(screen.getByLabelText(/country/i)).toHaveValue("");
    expect(screen.getByLabelText(/tax identifier/i)).toHaveValue("");
  });

  it("shows server error message on failed submission", async () => {
    const fetchMock = mockFetchFailure(400, "Invalid registration token.");
    render(<App />);

    fillBaseForm();
    fireEvent.change(screen.getByLabelText(/tax identifier/i), {
      target: { value: "1234-ABC-12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify & continue/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole("status")).toHaveTextContent(/invalid registration token/i);
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Alice Cooper");
  });
});
