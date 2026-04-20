import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CountryAutocomplete } from "../components/CountryAutocomplete";

describe("CountryAutocomplete", () => {
  it("opens on focus and typing", () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CountryAutocomplete
        value=""
        error={undefined}
        isOpen={false}
        options={[]}
        onChange={onChange}
        onOpenChange={onOpenChange}
      />,
    );

    const input = screen.getByLabelText(/country/i);

    fireEvent.focus(input);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.change(input, { target: { value: "Can" } });
    expect(onChange).toHaveBeenCalledWith("country", "Can");
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("closes after blur delay", () => {
    vi.useFakeTimers();

    const onChange = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CountryAutocomplete
        value="USA"
        error={undefined}
        isOpen={true}
        options={["USA"]}
        onChange={onChange}
        onOpenChange={onOpenChange}
      />,
    );

    const input = screen.getByLabelText(/country/i);
    fireEvent.blur(input);

    expect(onOpenChange).not.toHaveBeenCalledWith(false);

    vi.advanceTimersByTime(120);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    vi.useRealTimers();
  });

  it("selects a country and closes menu", () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CountryAutocomplete
        value=""
        error={undefined}
        isOpen={true}
        options={["USA", "Canada"]}
        onChange={onChange}
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.mouseDown(screen.getByRole("button", { name: "Canada" }));

    expect(onChange).toHaveBeenCalledWith("country", "Canada");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders empty-state message when no options", () => {
    render(
      <CountryAutocomplete
        value="Zzz"
        error={undefined}
        isOpen={true}
        options={[]}
        onChange={vi.fn()}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/no country match found/i)).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(
      <CountryAutocomplete
        value="Atlantis"
        error="Type and choose a country from the suggestions list."
        isOpen={false}
        options={[]}
        onChange={vi.fn()}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/suggestions list/i);
  });
});
