import type { SubmitState } from "../hooks/useRegistrationForm";
import { submitStateClassByType } from "./RegistrationForm.styles";

type SubmissionFeedbackProps = {
  submitState: SubmitState;
};

export function SubmissionFeedback({ submitState }: SubmissionFeedbackProps) {
  if (!submitState) {
    return null;
  }

  return (
    <div className="pt-6">
      <p
        className={`rounded-xl border px-4 py-3 text-sm font-medium ${submitStateClassByType[submitState.type]}`}
        role="status"
      >
        {submitState.message}
      </p>
    </div>
  );
}
