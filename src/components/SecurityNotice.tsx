import { securityDescriptionStyle, securityTitleStyle } from "./RegistrationForm.styles";

export function SecurityNotice() {
  return (
    <div className="pt-6">
      <div className="flex items-start gap-3.5">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-lg">🛡️</div>
        <div>
          <p className="font-bold text-slate-700" style={securityTitleStyle}>
            Military-Grade Security
          </p>
          <p className="mt-2 text-slate-500" style={securityDescriptionStyle}>
            Data is encrypted using military-grade AES-256 protocols. Your identifier is never stored in plain text.
          </p>
        </div>
      </div>
    </div>
  );
}
