import type { RegistrationValues } from "../utils/validation";

type CountryAutocompleteProps = {
  value: string;
  error?: string;
  isOpen: boolean;
  options: string[];
  onChange: (fieldName: keyof RegistrationValues, value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200/80 bg-slate-100 px-6 py-4 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200";

const closeMenuDelayMs = 120;

export function CountryAutocomplete({
  value,
  error,
  isOpen,
  options,
  onChange,
  onOpenChange,
}: CountryAutocompleteProps) {
  return (
    <div className="space-y-5 pb-5">
      <label htmlFor="country" className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        Country
      </label>
      <div className="relative">
        <input
          id="country"
          name="country"
          type="text"
          value={value}
          onChange={(event) => {
            onChange("country", event.target.value);
            onOpenChange(true);
          }}
          onFocus={() => onOpenChange(true)}
          onBlur={() => {
            setTimeout(() => onOpenChange(false), closeMenuDelayMs);
          }}
          placeholder="Type to search countries"
          className={inputClassName}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-autocomplete="list"
        />
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-base text-slate-500">
          ▾
        </span>

        {isOpen ? (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <ul className="max-h-52 overflow-y-auto py-1">
              {options.length > 0 ? (
                options.map((country) => (
                  <li key={country}>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                      onMouseDown={() => {
                        onChange("country", country);
                        onOpenChange(false);
                      }}
                    >
                      {country}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-slate-400">No country match found</li>
              )}
            </ul>
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
