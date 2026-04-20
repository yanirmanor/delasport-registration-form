import { headingDescriptionStyle } from "./RegistrationForm.styles";

export function RegistrationHero() {
  return (
    <div className="mx-auto mb-10 max-w-xl text-center md:pb-8">
      <h1 className="text-xl font-extrabold leading-[1] tracking-tight text-slate-800 md:text-4xl">
        Establish Your Digital Authority
      </h1>
      <p
        className="mx-auto pt-2 max-w-2xl text-slate-500"
        style={headingDescriptionStyle}
      >
        Join Delasport&apos;s high-trust platform for secure enterprise
        identifiers.
      </p>
    </div>
  );
}
