import { act, renderHook, waitFor } from "@testing-library/react";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { COUNTRY_NAMES } from "../utils/validation";

describe("useRegistrationForm", () => {
  it("uses custom submitRegistration and returns success", async () => {
    const submitRegistration = vi.fn().mockResolvedValue({
      message: "ok",
    });

    const { result } = renderHook(() => useRegistrationForm({ submitRegistration }));

    act(() => {
      result.current.handleFieldChange("fullName", "Alice Cooper");
    });
    act(() => {
      result.current.handleFieldChange("country", "USA");
    });
    act(() => {
      result.current.handleFieldChange("taxIdentifier", "1234-ABC-12345");
    });

    await act(async () => {
      const didSubmit = await result.current.submit();
      expect(didSubmit).toBe(true);
    });

    expect(submitRegistration).toHaveBeenCalledTimes(1);
    expect(result.current.submitState).toEqual({ type: "success", message: "ok" });
    expect(result.current.values).toEqual({
      fullName: "",
      country: "",
      taxIdentifier: "",
    });
  });

  it("falls back to generic error message when non-Error is thrown", async () => {
    const submitRegistration = vi.fn().mockRejectedValue("boom");

    const { result } = renderHook(() => useRegistrationForm({ submitRegistration }));

    act(() => {
      result.current.handleFieldChange("fullName", "Alice Cooper");
    });
    act(() => {
      result.current.handleFieldChange("country", "USA");
    });
    act(() => {
      result.current.handleFieldChange("taxIdentifier", "1234-ABC-12345");
    });

    await act(async () => {
      const didSubmit = await result.current.submit();
      expect(didSubmit).toBe(false);
    });

    expect(submitRegistration).toHaveBeenCalledTimes(1);
    expect(result.current.submitState).toEqual({
      type: "error",
      message: "Registration failed.",
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  it("returns all countries when query is empty and filters when populated", async () => {
    const { result } = renderHook(() => useRegistrationForm());

    expect(result.current.filteredCountryNames).toEqual(COUNTRY_NAMES);

    act(() => {
      result.current.handleFieldChange("country", "can");
    });

    await waitFor(() => {
      expect(result.current.filteredCountryNames).toEqual(["Canada"]);
    });
  });
});
