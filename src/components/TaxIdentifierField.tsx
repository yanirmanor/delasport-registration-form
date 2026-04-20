import { InputField } from "./InputField";

type TaxIdentifierFieldProps = {
  value: string;
  placeholder: string;
  hint: string;
  error?: string;
  onChange: (value: string) => void;
};

export function TaxIdentifierField({ value, placeholder, hint, error, onChange }: TaxIdentifierFieldProps) {
  return (
    <div className="pb-5">
      <InputField
        id="taxIdentifier"
        name="taxIdentifier"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        label="Tax Identifier"
        error={error}
      />
      <p className="mt-8 text-sm italic text-slate-500">{hint}</p>
    </div>
  );
}
