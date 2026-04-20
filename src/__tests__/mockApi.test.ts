import { submitRegistrationMock } from "../api/mockApi";

describe("submitRegistrationMock", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns success message for valid payload", async () => {
    vi.useFakeTimers();

    const promise = submitRegistrationMock({
      fullName: "Alice Cooper",
      country: "USA",
      taxIdentifier: "1234-ABC-12345",
    });

    await vi.advanceTimersByTimeAsync(900);

    await expect(promise).resolves.toEqual({
      message: "Registration completed successfully.",
    });
  });

  it("rejects when fullName contains 'error'", async () => {
    vi.useFakeTimers();

    const promise = submitRegistrationMock({
      fullName: "Error Case",
      country: "USA",
      taxIdentifier: "1234-ABC-12345",
    });
    const assertion = expect(promise).rejects.toThrow(/could not verify the registration data/i);

    await vi.advanceTimersByTimeAsync(900);

    await assertion;
  });

  it("rejects when taxIdentifier contains 'FAIL'", async () => {
    vi.useFakeTimers();

    const promise = submitRegistrationMock({
      fullName: "Alice Cooper",
      country: "USA",
      taxIdentifier: "1234-abc-FAIL",
    });
    const assertion = expect(promise).rejects.toThrow(/could not verify the registration data/i);

    await vi.advanceTimersByTimeAsync(900);

    await assertion;
  });
});
