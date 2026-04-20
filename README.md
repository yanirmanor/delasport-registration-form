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

## Mock Submit Behavior

Submission is mocked in `src/api/mockApi.ts`.

- Success: returns `Registration completed successfully.`
- Failure: throws when full name contains `error` or tax identifier contains `FAIL`
