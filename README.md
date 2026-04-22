# Delasport Registration Form

React + TypeScript + Vite implementation of the Delasport registration task.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Vitest + Testing Library
- OXC tooling (`oxlint`, `oxfmt`)

## Scripts

- `npm run dev`: start frontend
- `npm run test:run`: run tests once
- `npm run test:coverage`: run coverage report
- `npm run lint`: run oxlint
- `npm run format`: format files with oxfmt
- `npm run format:check`: formatting check only

## Submission Flows

Submission is mocked in `src/api/mockApi.ts` and simulates a network request (~900ms).

### Success flow

A submission succeeds when:

1. Client-side validation passes.
2. Full name does **not** contain `error` (case-insensitive).
3. Tax identifier does **not** contain `FAIL` (case-insensitive).

Result:

- Success message: `Registration completed successfully.`
- Form fields are reset.

### Failed flow

You can see two types of failures:

1. **Validation failure (before submit request)**
   - Example: full name shorter than 3 chars, country not selected from suggestions, invalid tax format for selected country.
   - Result: inline field errors.

2. **Mock API failure (after valid submit)**
   - Triggered when full name contains `error` or tax identifier contains `FAIL`.
   - Result: error message `Could not verify the registration data.`

## Manual Testing Guide

1. Start app: `npm run dev`
2. Open the local URL shown by Vite.

### Test success path

Use this sample:

- Full Name: `Jane Cooper`
- Country: `USA` (select from autocomplete list)
- Tax Identifier: `1234-ABC-12345`

Expected:

- Submit button shows loading state briefly.
- Success feedback appears.
- Form inputs are cleared.

### Test validation failure path

Try these checks:

- Full Name: `Al` → expect `Full name must be at least 3 characters.`
- Country: type random value not in suggestions (e.g. `Atlantis`) → expect country selection error.
- Country `USA` + Tax Identifier `12-ABC-123` → expect USA tax format error.

### Test mock API failure path

Use valid-looking inputs that pass validation but trigger mock failure:

- Full Name: `Error Example`
- Country: `Germany`
- Tax Identifier: `AB12-FAIL34`

Expected:

- Client validation passes.
- After loading, error feedback appears: `Could not verify the registration data.`
- Form values remain so you can adjust and resubmit.
